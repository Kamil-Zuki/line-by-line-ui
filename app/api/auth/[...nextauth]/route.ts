import NextAuth, { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt"; // Import JWT type

// Extend User type to include accessToken
interface CustomUser extends User {
  accessToken: string;
}

// Extend JWT type to include accessToken
interface CustomJWT extends JWT {
  accessToken?: string;
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const res = await fetch("http://85.175.218.17/api/v1/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        });

        const data = await res.json();
        if (res.ok && data.token) {
          return {
            id: "1",
            email: credentials?.email || "",
            accessToken: data.token, // Include accessToken
          } as CustomUser;
        }
        return null;
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    // ✅ Fix: Explicitly type token as CustomJWT
    async jwt({ token, user }) {
      if (user) {
        (token as CustomJWT).accessToken = (user as CustomUser).accessToken;
      }
      return token;
    },

    // ✅ Fix: Explicitly type token as CustomJWT in session callback
    async session({ session, token }) {
      session.user = session.user || {};
      (session.user as { accessToken?: string }).accessToken = (
        token as CustomJWT
      ).accessToken;
      return session;
    },
  },
} as NextAuthOptions);

export { handler as GET, handler as POST };
