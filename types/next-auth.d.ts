import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name:string;
      email:string;
      emailVerifiedAt: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    name:string;
    email:string;
    emailVerifiedAt: Date | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name:string;
    email:string;
    emailVerifiedAt: Date | null;
  }
}
