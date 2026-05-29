import { sendVerificationEmail } from "@/services/auth/draw/send-verification-email.service";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import type { User, EmailVerificationToken } from "@prisma/client";

export async function issueEmailVerificationToken(
  userId: string,
  email: string,
  resendVerificationKind: number,
) {
  const token = crypto.randomBytes(32).toString("hex");

  await prisma.$transaction(async (tx) => {
    await tx.emailVerificationToken.deleteMany({
      where: { userId },
    });

    await tx.emailVerificationToken.create({
      data: {
        userId,
        token,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60),
      },
    });
  });

  await sendVerificationEmail(email, token);
}