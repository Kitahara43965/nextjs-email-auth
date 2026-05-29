"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { RegisterErrors } from "@/types/auth";
import { redirectByAuth } from "@/services/auth/route/redirect-by-auth.service";
import { ResendVerificationKind } from "@/constants/resend-verification-kind.constant";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [registerErrors, setRegisterErrors] = useState<RegisterErrors>({});
  const [loading, setLoading] = useState(false);

  const getLogin = () => router.push("/login");

  const handleRegister = async () => {
    setRegisterErrors({});
    setLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name, confirmPassword }),
      });

      if (!response.ok) {
        const data = await response.json();
        setRegisterErrors(
          data.registerErrors || { general: "登録に失敗しました" },
        );
        setLoading(false);
        return;
      }

      const registerResponse = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (registerResponse?.error) {
        setRegisterErrors({
          general: "自動ログインに失敗しました。手動でログインしてください",
        });
      } else {
        await redirectByAuth(router, true);
      }
    } catch {
      setRegisterErrors({ general: "サーバーエラーが発生しました" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-6">会員登録</h1>

        {/* Name */}
        <div className="mb-4">
          <input
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="ユーザー名"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {registerErrors.name && (
            <p className="text-red-500 text-sm mt-1">{registerErrors.name}</p>
          )}
        </div>

        {/* Email */}
        <div className="mb-4">
          <input
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="メールアドレス"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {registerErrors.email && (
            <p className="text-red-500 text-sm mt-1">{registerErrors.email}</p>
          )}
        </div>

        {/* Password */}
        <div className="mb-4">
          <input
            type="password"
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="パスワード"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {registerErrors.password && (
            <p className="text-red-500 text-sm mt-1">
              {registerErrors.password}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="mb-4">
          <input
            type="password"
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="パスワード(確認用)"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {registerErrors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              {registerErrors.confirmPassword}
            </p>
          )}
        </div>

        {/* General Error */}
        {registerErrors.general && (
          <p className="text-red-600 text-center mb-4">
            {registerErrors.general}
          </p>
        )}

        {/* Register Button */}
        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:bg-gray-400"
        >
          {loading ? "登録中..." : "会員登録"}
        </button>

        {/* Login Link */}
        <button
          onClick={getLogin}
          className="w-full mt-4 text-blue-600 hover:underline text-center"
        >
          ログイン
        </button>
      </div>
    </div>
  );
}
