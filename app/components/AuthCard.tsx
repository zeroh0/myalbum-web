import Link from "next/link";
import type { ReactNode } from "react";

export default function AuthCard({
  title,
  children,
  footer,
}: {
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-12 dark:bg-black">
      <div className="w-full max-w-sm">
        <Link
          href="/"
          className="mb-8 block text-center text-xl font-bold text-zinc-900 dark:text-zinc-50"
        >
          MyAlbum
        </Link>
        <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <h1 className="mb-6 text-center text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            {title}
          </h1>
          {children}
        </div>
        {footer && (
          <p className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
            {footer}
          </p>
        )}
      </div>
    </div>
  );
}
