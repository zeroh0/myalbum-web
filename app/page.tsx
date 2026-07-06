import Link from "next/link";
import PinterestGrid from "@/app/components/PinterestGrid";
import { photos } from "@/app/lib/photos";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-200 bg-white/80 px-4 py-4 backdrop-blur-md dark:border-zinc-800 dark:bg-black/80 sm:px-8">
        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
          MyAlbum
        </h1>
        <div className="flex items-center gap-2">
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
        </div>
      </header>
      <main className="px-3 py-6 sm:px-6">
        <PinterestGrid photos={photos} />
      </main>
    </div>
  );
}
