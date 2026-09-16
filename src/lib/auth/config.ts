import NextAuth, { type NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import { isOwnerEmail } from "@/lib/auth/owner";

export { isOwnerEmail } from "@/lib/auth/owner";

export function authConfiguration(): NextAuthConfig {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const providers = clientId && clientSecret
    ? [Google({
        clientId,
        clientSecret,
        authorization: {
          params: {
            access_type: "offline",
            prompt: "consent",
            scope: "openid email profile https://www.googleapis.com/auth/gmail.modify https://www.googleapis.com/auth/gmail.send",
          },
        },
      })]
    : [];

  return {
    trustHost: true,
    providers,
    session: { strategy: "jwt" },
    callbacks: {
      signIn({ user }) {
        return isOwnerEmail(user.email);
      },
      authorized({ auth }) {
        return isOwnerEmail(auth?.user?.email);
      },
    },
  };
}

export const authConfigured = Boolean(
  process.env.AUTH_SECRET &&
  process.env.AUTH_OWNER_EMAIL &&
  process.env.GOOGLE_CLIENT_ID &&
  process.env.GOOGLE_CLIENT_SECRET,
);

const authResult = NextAuth(authConfiguration());
export const { handlers, signIn, signOut, auth } = authResult;
