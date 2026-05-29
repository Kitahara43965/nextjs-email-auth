import { prisma } from "@/lib/prisma";
import type { User, EmailVerificationToken } from "@prisma/client";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  if (!token) {
    return Response.redirect(`${baseUrl}/verify`);
  }

  // 🔍 まずtoken取得
  const emailVerificationToken =
    await prisma.emailVerificationToken.findFirst({
      where: { token },
  });
  

  if (!emailVerificationToken || emailVerificationToken.expiresAt < new Date()) {
    return Response.redirect(`${baseUrl}/verify?error=invalid`);
  }

  if (emailVerificationToken.expiresAt < new Date()) {
    return Response.redirect(`${baseUrl}/verify?error=expired`);
  }

  // 🔥 最新tokenチェック（ここが重要）

  const latestEmailVerificationToken = await prisma.emailVerificationToken.findFirst({
    where: {
      userId: emailVerificationToken.userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });



  // ✔ 認証処理
  await prisma.$transaction([
    prisma.user.update({
      where: { id: emailVerificationToken.userId },
      data: {
        emailVerifiedAt: new Date(),
      },
    }),
    prisma.emailVerificationToken.deleteMany({
      where: { userId: emailVerificationToken.userId },
    }),
  ]);

  return Response.redirect(`${baseUrl}/dashboard`);
}