"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoginErrors } from "@/types/auth";
import { redirectByAuth } from "@/services/auth/route/redirect-by-auth.service";
import { ResendVerificationKind } from "@/constants/resend-verification-kind.constant";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginErrors, setLoginErrors] = useState<LoginErrors>({});
  const [loading, setLoading] = useState(false);
  const getRegister = () => router.push("/register");
  const handleLogin = async () => {
    let isVerificationMailSent: boolean = false;
    let formDataResendVerification: FormData | null = null;
    let resendVerificationKind: number = ResendVerificationKind.UNDEFINED;

    if (loading) return;
    setLoading(true);

    const newErrors: LoginErrors = {};

    if (!email) newErrors.email = "メールアドレスを入力してください";
    else if (!email.includes("@"))
      newErrors.email = "正しいメールアドレスを入力してください";

    if (!password) newErrors.password = "パスワードを入力してください";

    if (Object.keys(newErrors).length > 0) {
      setLoginErrors(newErrors);
      setLoading(false);
      return;
    }

    setLoginErrors({});

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setLoginErrors({
        general: "メールアドレスまたはパスワードが間違っています",
      });
    } else {
      resendVerificationKind = ResendVerificationKind.LOGIN;
      formDataResendVerification = new FormData();
      formDataResendVerification.append(
        "stringResendVerificationKind",
        resendVerificationKind.toString(),
      );

      const response = await fetch("/api/resend-verification", {
        method: "POST",
        body: formDataResendVerification,
      });

      const data = await response.json();

      isVerificationMailSent = data.isVerificationMailSent;

      await redirectByAuth(router, isVerificationMailSent);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-6">ログイン</h1>

        {/* Email */}
        <div className="mb-4">
          <input
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="メールアドレス"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setLoginErrors((prev) => ({
                ...prev,
                email: undefined,
                general: undefined,
              }));
            }}
          />
          {loginErrors.email && (
            <p className="text-red-500 text-sm mt-1">{loginErrors.email}</p>
          )}
        </div>

        {/* Password */}
        <div className="mb-4">
          <input
            type="password"
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="パスワード"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setLoginErrors((prev) => ({
                ...prev,
                password: undefined,
                general: undefined,
              }));
            }}
          />
          {loginErrors.password && (
            <p className="text-red-500 text-sm mt-1">{loginErrors.password}</p>
          )}
        </div>

        {/* General Error */}
        {loginErrors.general && (
          <p className="text-red-600 text-center mb-4">{loginErrors.general}</p>
        )}

        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:bg-gray-400"
        >
          {loading ? "ログイン中..." : "ログイン"}
        </button>

        {/* Register Link */}
        <button
          onClick={getRegister}
          className="w-full mt-4 text-blue-600 hover:underline text-center"
        >
          会員登録
        </button>
      </div>
    </div>
  );
}
