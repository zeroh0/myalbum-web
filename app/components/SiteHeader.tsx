"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/lib/auth-context";

export default function SiteHeader() {
  const router = useRouter();
  const { member, loading, logout } = useAuth();

  async function handleLogout() {
    await logout();
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-200 bg-white/80 px-4 py-4 backdrop-blur-md dark:border-zinc-800 dark:bg-black/80 sm:px-8">
      <Link
        href="/"
        className="text-xl font-bold text-zinc-900 dark:text-zinc-50"
      >
        MyAlbum
      </Link>
      <div className="flex items-center gap-2">
        {loading ? null : member ? (
          <>
            <Link
              href={`/album/${member.username}`}
              className="rounded-full px-4 py-2 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-100 dark:text-zinc-50 dark:hover:bg-zinc-800"
            >
              내 앨범
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full px-4 py-2 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-100 dark:text-zinc-50 dark:hover:bg-zinc-800"
            >
              로그아웃
            </button>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="rounded-full px-4 py-2 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-100 dark:text-zinc-50 dark:hover:bg-zinc-800"
            >
              로그인
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700"
            >
              회원가입
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
