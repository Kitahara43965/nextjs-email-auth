"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LogoutButton from "@/app/components/LogoutButton";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // 未ログインならログインページへ
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow rounded-lg">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>

      <p className="text-lg mb-6">
        ようこそ、<span className="font-semibold">{session?.user?.name}</span>{" "}
        さん！
      </p>

      <div className="mt-5 mb-5 text-blue-500 text-3xl font-bold">
        よろしくお願いします。
      </div>

      <LogoutButton />
    </div>
  );
}
