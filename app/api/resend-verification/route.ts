import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { resendVerification } from "@/services/auth/resend-verification.service";
import { ResendVerificationResult } from "@/types/resend-verification-result.type";
import { ResendVerificationKind } from "@/constants/resend-verification-kind.constant";

export async function POST(req: Request) {
  const formDataResendVerification = await req.formData();
  const session = await getServerSession(authOptions);
  let resendVerificationResult: ResendVerificationResult | null = null;
  const stringResendVerificationKind = formDataResendVerification.get(
    "stringResendVerificationKind",
  );
  let resendVerificationKind: number = ResendVerificationKind.UNDEFINED;

  if (stringResendVerificationKind) {
    resendVerificationKind = Number(stringResendVerificationKind);
  } //stringResendVerificationKind

  if (!Number.isNaN(resendVerificationKind)) {
    resendVerificationResult = await resendVerification(
      session?.user.id,
      resendVerificationKind,
    );
  }

  return Response.json(resendVerificationResult);
}
