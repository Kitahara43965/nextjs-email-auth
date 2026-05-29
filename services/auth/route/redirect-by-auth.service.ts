import { getSession } from "next-auth/react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export async function redirectByAuth(
  router: AppRouterInstance,
  isVerificationMailSent: boolean,
) {
  const session = await getSession();

  if (!session?.user) {
    router.push("/login");
    return;
  }

  if (isVerificationMailSent === true) {
    router.push("/verify");
    return;
  }

  router.push("/dashboard");
}
