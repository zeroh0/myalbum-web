"use client";

import { useEffect, useState } from "react";
import SiteHeader from "@/app/components/SiteHeader";
import PinterestGrid from "@/app/components/PinterestGrid";
import PhotoDetailModal from "@/app/components/PhotoDetailModal";
import type { Photo } from "@/app/lib/photo";
import type { ApiResponse } from "@/app/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export default function Home() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadPhotos() {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/photos/main`);
        const body: ApiResponse<Photo[]> = await res.json();
        if (!cancelled && body.success && body.data) {
          setPhotos(body.data);
        }
      } catch {
        // 홈 피드는 비로그인 사용자도 보므로 실패 시 빈 상태로 둔다.
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadPhotos();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <SiteHeader />
      <main className="px-3 py-6 sm:px-6">
        {loading ? null : photos.length === 0 ? (
          <p className="py-20 text-center text-sm text-zinc-500 dark:text-zinc-400">
            아직 등록된 사진이 없습니다.
          </p>
        ) : (
          <PinterestGrid photos={photos} onSelect={setSelectedPhoto} />
        )}
      </main>

      {selectedPhoto && (
        <PhotoDetailModal
          photo={selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
        />
      )}
    </div>
  );
}
