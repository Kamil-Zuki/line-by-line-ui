// app/types/next-auth.d.ts
import NextAuth from "next-auth";
import { DefaultUser } from "next-auth";

// Module Augmentation
declare module "next-auth" {
  interface User extends DefaultUser {
    accessToken?: string; // Add accessToken to User
  }

  interface Session {
    user: User; // Use the extended User type in Session
  }

  interface JWT {
    accessToken?: string; // Add accessToken to JWT
  }
}
