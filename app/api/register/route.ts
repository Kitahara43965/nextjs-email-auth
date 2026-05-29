import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/crypto";
import { RegisterErrors } from "@/types/auth";
import { resendVerification } from "@/services/auth/resend-verification.service";
import { ResendVerificationResult } from "@/types/resend-verification-result.type";
import { ResendVerificationKind } from "@/constants/resend-verification-kind.constant";

export async function POST(req: Request) {
  const { name, email, password, confirmPassword } = await req.json();

  const registerErrors: RegisterErrors = {};

  const existing = await prisma.user.findUnique({
    where: { email },
  });

  let resendVerificationResult: ResendVerificationResult | null = null;

  if (!name) registerErrors.name = "ユーザー名を入力してください";
  if (!email || !email.includes("@"))
    registerErrors.email = "正しいメールアドレスを入力してください";
  if (!password || password.length < 8)
    registerErrors.password = "パスワードは8文字以上で入力してください";
  if (password !== confirmPassword)
    registerErrors.confirmPassword = "パスワードが一致しません";
  if (existing) registerErrors.email = "ユーザーはすでに存在します";

  if (Object.keys(registerErrors).length > 0) {
    return Response.json({ registerErrors }, { status: 400 });
  }

  const hashed = hashPassword(password);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashed,
      name,
      loginTimeNumber: 0,

      userSetting: {
        create: {
          hasNotifyLoginEmail: true,
        },
      },
    },

    include: {
      userSetting: true,
    },
  });

  resendVerificationResult = await resendVerification(
    user.id,
    ResendVerificationKind.REGISTER,
  );

  return Response.json({
    id: user.id,
    email: user.email,
    name: user.name,
  });
}
