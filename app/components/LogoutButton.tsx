"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition"
    >
      ログアウト
    </button>
  );
}
