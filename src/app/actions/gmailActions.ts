"use server";
import { google, gmail_v1 as gmailV1 } from "googleapis";
import { createClient } from "utils/supabase/server";

// --- Gmail API Type Interfaces ---
interface GmailMessagePartBody {
  attachmentId?: string | null;
  size?: number | null;
  data?: string | null;
}

interface GmailMessagePart {
  partId?: string | null;
  mimeType?: string | null;
  filename?: string | null;
  headers?: gmailV1.Schema$MessagePartHeader[] | null;
  body?: GmailMessagePartBody | null;
  parts?: GmailMessagePart[] | null;
}

// This is our specific understanding of the payload for format: "full"
interface GmailRichPayload {
  partId?: string | null;
  mimeType?: string | null;
  filename?: string | null;
  headers?: gmailV1.Schema$MessagePartHeader[] | null;
  body?: GmailMessagePartBody | null;
  parts?: GmailMessagePart[] | null;
}

// Use an intersection type
type GmailFullMessage = Omit<gmailV1.Schema$Message, "payload"> & {
  payload?: GmailRichPayload | null;
};

// --- Helper Functions ---
function base64UrlDecode(str: string): string {
  if (typeof str !== "string") {
    console.warn("base64UrlDecode received non-string input:", str);
    return "";
  }
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  try {
    return Buffer.from(base64, "base64").toString("utf-8");
  } catch (error) {
    console.error("Error decoding base64 string:", str, error);
    return "[Decoding Error]";
  }
}

// Updated to use GmailRichPayload
function getEmailBody(payload: GmailRichPayload | null | undefined): string {
  if (!payload) {
    return "";
  }

  let bodyData: string | null | undefined = "";

  if (payload.body && payload.body.data) {
    bodyData = payload.body.data;
  }

  if (payload.parts && payload.parts.length > 0) {
    let plainTextPartData: string | null | undefined = null;
    let htmlPartData: string | null | undefined = null;

    const findPartsRecursive = (parts: GmailMessagePart[]): void => {
      for (const part of parts) {
        if (part.mimeType === "text/plain" && part.body && part.body.data) {
          plainTextPartData = part.body.data;
          return;
        } else if (
          part.mimeType === "text/html" &&
          part.body &&
          part.body.data
        ) {
          htmlPartData = part.body.data;
        } else if (part.parts && part.parts.length > 0) {
          findPartsRecursive(part.parts);
          if (plainTextPartData) return;
        }
      }
    };

    findPartsRecursive(payload.parts);

    if (plainTextPartData) {
      bodyData = plainTextPartData;
    } else if (htmlPartData) {
      bodyData = htmlPartData;
    }
  }

  if (bodyData) {
    return base64UrlDecode(bodyData);
  }
  return "";
}

// --- API Error Type Guard ---
interface ApiError extends Error {
  code?: number;
  errors?: Array<{ message: string; domain?: string; reason?: string }>;
}

function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === "object" &&
    error !== null &&
    ("message" in error || "code" in error)
  );
}

// --- Main Function ---
export async function fetchUserEmails(filterBySenderEmail?: string) {
  const supabase = await createClient();

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) {
    console.error("Session error:", sessionError.message);
    return { error: "Failed to get session: " + sessionError.message };
  }

  if (!session) {
    return { error: "User not authenticated." };
  }

  //! This seems to be limited at the moment and should be fixed in the future
  const googleAccessToken = session.provider_token;
  //! This seems to be null at the moment and is not being provided by google
  const googleRefreshToken = session.provider_refresh_token;

  if (!googleAccessToken) {
    return {
      error:
        "Google access token not found in session. Did you sign in with Google and grant permissions?",
    };
  }

  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const appUrl = process.env.APP_URL;

  if (!googleClientId || !googleClientSecret || !appUrl) {
    console.warn(
      "Missing Google OAuth credentials or APP_URL in environment variables. Token refresh might not work effectively."
    );
  }

  const redirectUri = `${appUrl}/api/auth/callback`;

  const oauth2Client = new google.auth.OAuth2(
    googleClientId,
    googleClientSecret,
    redirectUri
  );

  oauth2Client.setCredentials({
    access_token: googleAccessToken,
    refresh_token: googleRefreshToken,
  });

  oauth2Client.on("tokens", (tokens) => {
    if (tokens.access_token) {
      console.log("Google Access Token was refreshed.");
    }
    if (tokens.refresh_token) {
      console.log("A new Google Refresh Token was issued (rare).");
    }
  });

  const gmail = google.gmail({ version: "v1", auth: oauth2Client });

  try {
    let queryString = "in:inbox";
    if (filterBySenderEmail && filterBySenderEmail.trim() !== "") {
      queryString += ` from:${filterBySenderEmail.trim()}`;
    }
    console.log("Using Gmail query:", queryString);

    const messagesRes = await gmail.users.messages.list({
      userId: "me",
      maxResults: 10, // should be changed to a good amount like 50 or so? Or as is.
      q: queryString,
    });

    const messages = messagesRes.data.messages || [];

    if (messages.length === 0) {
      return {
        data: {
          messages: [],
          messageDetails: `No messages found${
            filterBySenderEmail ? ` from ${filterBySenderEmail}` : ""
          }.`,
        },
      };
    }

    const detailedMessagesPromises = messages.map(async (message) => {
      if (message.id && message.threadId) {
        // Ensure id and threadId exist
        const msgRes = await gmail.users.messages.get({
          userId: "me",
          id: message.id,
          format: "full",
        });

        // Cast the data to our GmailFullMessage type
        const msgData = msgRes.data as GmailFullMessage;
        if (!msgData) return null;

        const headers = msgData.payload?.headers || [];
        const subject =
          headers.find((h) => h.name === "Subject")?.value || undefined;
        const from = headers.find((h) => h.name === "From")?.value || undefined;
        const date = headers.find((h) => h.name === "Date")?.value || undefined;

        const body = getEmailBody(msgData.payload); // Pass our specific payload type

        return {
          id: msgData.id,
          threadId: msgData.threadId, // Added threadId as it's usually useful
          snippet: msgData.snippet,
          subject,
          from,
          date,
          body,
        };
      }
      return null;
    });

    const detailedMessages = (
      await Promise.all(detailedMessagesPromises)
    ).filter((msg): msg is NonNullable<typeof msg> => msg !== null);

    return { data: { messages: detailedMessages } };
  } catch (err: unknown) {
    console.error("The API returned an error: ", err);
    if (isApiError(err)) {
      if (err.code === 401) {
        return {
          error:
            "Google API authentication failed. Token might be invalid, expired, or refresh failed. Try signing out and in again.",
        };
      }
      if (err.code === 403) {
        const apiErrorMessage =
          err.errors?.[0]?.message ||
          err.message ||
          "Permission denied or bad request.";
        return {
          error: `Google API Error: ${apiErrorMessage}. Check scopes, API enablement, and query.`,
        };
      }
      const errorMessage = err.errors?.[0]?.message || err.message;
      return { error: "Failed to fetch emails: " + errorMessage };
    } else if (err instanceof Error) {
      return { error: "Failed to fetch emails: " + err.message };
    } else {
      return { error: "An unexpected error occurred while fetching emails." };
    }
  }
}
