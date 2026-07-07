"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import SiteHeader from "@/app/components/SiteHeader";
import AlbumCard from "@/app/components/AlbumCard";
import CreateAlbumModal from "@/app/components/CreateAlbumModal";
import { useAuth } from "@/app/lib/auth-context";
import type { ApiResponse } from "@/app/lib/api";
import type { AlbumListItem } from "@/app/lib/album";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export default function AlbumGalleryPage() {
  const { username } = useParams<{ username: string }>();
  const { accessToken, member, loading: authLoading } = useAuth();

  const [albums, setAlbums] = useState<AlbumListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const isOwner = !authLoading && member?.username === username;

  const loadAlbums = useCallback(async () => {
    setLoading(true);
    setNotFound(false);
    try {
      const res = await fetch(`${API_URL}/api/album/list/${username}`, {
        headers: accessToken
          ? { Authorization: `Bearer ${accessToken}` }
          : undefined,
      });
      const body: ApiResponse<AlbumListItem[]> = await res.json();
      if (!body.success || !body.data) {
        setNotFound(true);
        setAlbums([]);
        return;
      }
      setAlbums(body.data);
    } catch {
      setNotFound(true);
      setAlbums([]);
    } finally {
      setLoading(false);
    }
  }, [username, accessToken]);

  useEffect(() => {
    if (authLoading) return;
    loadAlbums();
  }, [authLoading, loadAlbums]);

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <SiteHeader />
      <main className="px-3 py-6 sm:px-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
            {username}
            <span className="ml-1 font-normal text-zinc-500 dark:text-zinc-400">
              님의 앨범
            </span>
          </h1>
          {isOwner && (
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700"
            >
              앨범 생성
            </button>
          )}
        </div>

        {loading ? null : notFound ? (
          <p className="py-20 text-center text-sm text-zinc-500 dark:text-zinc-400">
            사용자를 찾을 수 없습니다.
          </p>
        ) : albums.length === 0 ? (
          <p className="py-20 text-center text-sm text-zinc-500 dark:text-zinc-400">
            {isOwner
              ? "아직 앨범이 없어요. 첫 앨범을 만들어보세요!"
              : "아직 등록된 앨범이 없습니다."}
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {albums.map((album) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
        )}
      </main>

      {modalOpen && (
        <CreateAlbumModal
          onClose={() => setModalOpen(false)}
          onCreated={() => {
            setModalOpen(false);
            loadAlbums();
          }}
        />
      )}
    </div>
  );
}
