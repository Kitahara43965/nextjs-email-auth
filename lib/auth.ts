import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/crypto";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },

          include: {
            userSetting: true,
          },
        });

        if (!user) return null;

        const ok = await verifyPassword(credentials.password, user.password);
        if (!ok) return null;

        // ログイン回数
        await prisma.user.update({
          where: { id: user.id },
          data: {
            loginTimeNumber: { increment: 1 },
          },
        });

        // ★ここが重要：ユーザー情報を返す
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          emailVerifiedAt: user.emailVerifiedAt,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token }) {
      if (token.email) {
        const dbUser = await prisma.user.findUnique({
          where: {
            email: token.email,
          },
        });

        if (dbUser) {
          token.id = dbUser.id;
          token.name = dbUser.name;
          token.email = dbUser.email;
          token.emailVerifiedAt = dbUser.emailVerifiedAt;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.emailVerifiedAt = token.emailVerifiedAt;
      }

      return session;
    },
  },
};
