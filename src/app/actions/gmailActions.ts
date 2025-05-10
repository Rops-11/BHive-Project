// app/actions/gmailActions.ts
"use server";

import { google } from "googleapis";
import { createClient } from "@/../utils/supabase/server";

// Define interfaces for expected error structures
interface GoogleApiErrorDetail {
  message: string;
  domain?: string;
  reason?: string;
}

// This interface represents the structure of an error object that might
// come from the googleapis library or a similar HTTP client error.
interface ApiError extends Error {
  // Extends the base Error type
  code?: number; // Typically an HTTP status code
  errors?: GoogleApiErrorDetail[]; // Google API often returns an array of error details
}

function isApiError(error: unknown): error is ApiError {
  if (error && typeof error === "object") {
    // Check for properties common in API errors
    // 'code' might not always be present, but 'message' (from Error) should be.
    // 'errors' is specific to some API error formats (like Google's).
    return "message" in error; // Basic check that it's at least Error-like
    // More specific checks can be added if needed:
    // && (typeof (error as ApiError).code === 'number' || (error as ApiError).code === undefined)
    // && (Array.isArray((error as ApiError).errors) || (error as ApiError).errors === undefined)
  }
  return false;
}

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

  const googleAccessToken = session.provider_token;
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
      "Missing Google OAuth credentials or APP_URL in environment variables. Token refresh by googleapis library might not work effectively."
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
      console.log("Google Access Token was refreshed by googleapis library.");
    }
    if (tokens.refresh_token) {
      console.log(
        "A new Google Refresh Token was issued by googleapis library (uncommon)."
      );
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
      maxResults: 100,
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

    const detailedMessages = await Promise.all(
      messages.map(async (message) => {
        if (message.id) {
          const msg = await gmail.users.messages.get({
            userId: "me",
            id: message.id,
            format: "metadata",
            metadataHeaders: ["Subject", "From", "Date"],
          });
          return {
            id: msg.data.id,
            snippet: msg.data.snippet,
            subject: msg.data.payload?.headers?.find(
              (h) => h.name === "Subject"
            )?.value,
            from: msg.data.payload?.headers?.find((h) => h.name === "From")
              ?.value,
            date: msg.data.payload?.headers?.find((h) => h.name === "Date")
              ?.value,
          };
        }
        return null;
      })
    );

    return { data: { messages: detailedMessages.filter(Boolean) } };
  } catch (err: unknown) {
    // Step 1: Catch as unknown
    console.error("The API returned an error: ", err); // Log the raw error for debugging

    // Step 2: Use type guards or checks to narrow down the type
    if (isApiError(err)) {
      // Our custom type guard
      if (err.code === 401) {
        return {
          error:
            "Google API authentication failed. Token might be invalid, expired, or refresh failed. Try signing out and in again with Google.",
        };
      }
      if (err.code === 403) {
        // Try to get a more specific message from the 'errors' array if it exists
        const apiErrorMessage =
          err.errors && err.errors[0] && err.errors[0].message
            ? err.errors[0].message
            : err.message || "Permission denied or bad request."; // Fallback to err.message
        return {
          error: `Google API Error: ${apiErrorMessage}. Ensure scopes are correct, API is enabled, and query is valid.`,
        };
      }
      // For other ApiErrors, try to extract the message
      const errorMessage =
        err.errors && err.errors[0] && err.errors[0].message
          ? err.errors[0].message
          : err.message; // Fallback to the main error message
      return { error: "Failed to fetch emails: " + errorMessage };
    } else if (err instanceof Error) {
      // If it's a standard Error object but not fitting our ApiError structure specifically
      return { error: "Failed to fetch emails: " + err.message };
    } else {
      // Fallback for completely unknown error types (e.g., if a string was thrown)
      return { error: "An unexpected error occurred while fetching emails." };
    }
  }
}
