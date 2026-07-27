import NextAuth, { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";

const clientId = (process.env.GITHUB_CLIENT_ID || "Ov23liIPXA7nnpt2zhsS").trim().replace(/['"]/g, "");
const clientSecret = (process.env.GITHUB_CLIENT_SECRET || "74fb900add24565f360bbd6adc0c8de9d496cda7").trim().replace(/['"]/g, "");
const nextAuthSecret = (process.env.NEXTAUTH_SECRET || "devprofile-builder-secret-key-12345").trim().replace(/['"]/g, "");

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: clientId,
      clientSecret: clientSecret,
      authorization: {
        params: {
          scope: "read:user repo",
        },
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: nextAuthSecret,
  callbacks: {
    async signIn() {
      return true;
    },
    async jwt({ token, account, profile }: any) {
      if (account) {
        token.accessToken = account.access_token;
      }
      if (profile) {
        token.username = profile.login;
      }
      return token;
    },
    async session({ session, token }: any) {
      (session as any).accessToken = token.accessToken;
      if (session.user) {
        (session.user as any).username = token.username;
      }
      return session;
    },
  },
  debug: true,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
