"use client";

import { useState } from "react";
import { buildUploadFileUrl, type AlbumListItem } from "@/app/lib/album";

export default function AlbumCard({ album }: { album: AlbumListItem }) {
  const [imgError, setImgError] = useState(false);
  const coverUrl = album.uploadFile
    ? buildUploadFileUrl(album.uploadFile.url)
    : null;

  return (
    <div className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950">
      <div className="relative aspect-square w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900">
        {coverUrl && !imgError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverUrl}
            alt={album.title}
            onError={() => setImgError(true)}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-zinc-300 dark:text-zinc-700">
            <svg
              viewBox="0 0 24 24"
              className="h-10 w-10"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              aria-hidden="true"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="9.5" r="1.5" />
              <path d="M21 15l-5-5-9 9" />
            </svg>
          </div>
        )}
      </div>
      <div className="p-3">
        <p className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          {album.title}
        </p>
      </div>
    </div>
  );
}
