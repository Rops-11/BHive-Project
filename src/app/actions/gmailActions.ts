// app/actions/gmailActions.ts
"use server";

import { google } from "googleapis";
import { createClient } from "@/../utils/supabase/server";

// Add a new parameter for the sender's email
export async function fetchUserEmails(filterBySenderEmail?: string) { // Make it optional or required as needed
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
    console.warn( // Changed to warn as it might still work if token is fresh
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
    // Construct the query string
    let queryString = "in:inbox"; // Default to search in inbox

    if (filterBySenderEmail && filterBySenderEmail.trim() !== "") {
      // Add the sender filter if provided
      // Ensure to escape or handle special characters in email if necessary, though Gmail usually handles simple emails fine.
      queryString += ` from:${filterBySenderEmail.trim()}`;
    }

    console.log("Using Gmail query:", queryString); // For debugging

    const messagesRes = await gmail.users.messages.list({
      userId: "me",
      maxResults: 100, // You can adjust this
      q: queryString, // Use the constructed query string
      // labelIds: ["INBOX"] // You can remove this if "in:inbox" is in q, or keep it as an AND condition
    });

    const messages = messagesRes.data.messages || [];

    if (messages.length === 0) {
      return { data: { messages: [], messageDetails: `No messages found${filterBySenderEmail ? ` from ${filterBySenderEmail}` : ''}.` } };
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
  } catch (err: any) {
    console.error("The API returned an error: ", err);
    if (err.code === 401) {
      return {
        error:
          "Google API authentication failed. Token might be invalid, expired, or refresh failed. Try signing out and in again with Google.",
      };
    }
    if (err.code === 403) { // This could also be a bad query
      const apiErrorMessage = err.errors && err.errors[0] && err.errors[0].message ? err.errors[0].message : "Permission denied or bad request.";
      return {
        error:
          `Google API Error: ${apiErrorMessage}. Ensure scopes are correct, API is enabled, and query is valid.`,
      };
    }
    const errorMessage =
      err.errors && err.errors[0] && err.errors[0].message
        ? err.errors[0].message
        : err.message;
    return { error: "Failed to fetch emails: " + errorMessage };
  }
}