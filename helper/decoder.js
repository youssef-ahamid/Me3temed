import { OAuth2Client } from "google-auth-library";
/**
 * @description Function to decode Google OAuth token
 * @param token the OAuth token obtained from the sign in button
 * @returns ticket object
 */
export const getDecodedOAuthJwtGoogle = async (token) => {
  const CLIENT_ID_GOOGLE = "{{ client_id }}";

  try {
    const client = new OAuth2Client(CLIENT_ID_GOOGLE);

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID_GOOGLE,
    });

    return ticket;
  } catch (error) {
    return { status: 500, data: error };
  }
};
