"use client";

import {
  useCallback,
  useEffect,
  useState,
  type ChangeEvent,
  type DragEvent,
} from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import SiteHeader from "@/app/components/SiteHeader";
import { useAuth } from "@/app/lib/auth-context";
import { buildUploadFileUrl } from "@/app/lib/album";
import type { ApiResponse } from "@/app/lib/api";
import type { AlbumPhotoList } from "@/app/lib/photo";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

type PendingFile = {
  key: string;
  file: File;
  previewUrl: string;
};

type UploadedImage = {
  thumbnailImageFile: { id: number };
  originalImageFile: { id: number };
};

export default function AlbumDetailPage() {
  const { username, albumId } = useParams<{
    username: string;
    albumId: string;
  }>();
  const { accessToken, loading: authLoading } = useAuth();

  const [data, setData] = useState<AlbumPhotoList | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [dragOverDrop, setDragOverDrop] = useState(false);

  const [draggingPendingIndex, setDraggingPendingIndex] = useState<
    number | null
  >(null);
  const [dragOverPendingIndex, setDragOverPendingIndex] = useState<
    number | null
  >(null);

  const [draggingPhotoIndex, setDraggingPhotoIndex] = useState<number | null>(
    null,
  );
  const [dragOverPhotoIndex, setDragOverPhotoIndex] = useState<number | null>(
    null,
  );

  const isOwner = data?.owner ?? false;

  const loadData = useCallback(async () => {
    setLoading(true);
    setNotFound(false);
    try {
      const res = await fetch(`${API_URL}/api/photos/${albumId}`, {
        headers: accessToken
          ? { Authorization: `Bearer ${accessToken}` }
          : undefined,
      });
      const body: ApiResponse<AlbumPhotoList> = await res.json();
      if (!body.success || !body.data) {
        setNotFound(true);
        setData(null);
        return;
      }
      setData(body.data);
    } catch {
      setNotFound(true);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [albumId, accessToken]);

  useEffect(() => {
    if (authLoading) return;
    loadData();
  }, [authLoading, loadData]);

  function addFiles(files: FileList | File[]) {
    const imageFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/"),
    );
    const newPending = imageFiles.map((file) => ({
      key: `${file.name}-${file.size}-${Math.random().toString(36).slice(2)}`,
      file,
      previewUrl: URL.createObjectURL(file),
    }));
    setPendingFiles((prev) => [...prev, ...newPending]);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragOverDrop(false);
    if (event.dataTransfer.files?.length) {
      addFiles(event.dataTransfer.files);
    }
  }

  function handleFileInputChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files?.length) {
      addFiles(event.target.files);
    }
    event.target.value = "";
  }

  function removePendingFile(key: string) {
    setPendingFiles((prev) => {
      const target = prev.find((p) => p.key === key);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((p) => p.key !== key);
    });
  }

  function handlePendingDrop(index: number) {
    const from = draggingPendingIndex;
    setDraggingPendingIndex(null);
    setDragOverPendingIndex(null);
    if (from === null || from === index) return;
    setPendingFiles((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(index, 0, moved);
      return next;
    });
  }

  async function handleUploadSubmit() {
    if (pendingFiles.length === 0 || !accessToken) return;

    setUploading(true);
    setUploadError("");
    try {
      const formData = new FormData();
      pendingFiles.forEach((p) => formData.append("files", p.file));

      const uploadRes = await fetch(`${API_URL}/api/upload/images`, {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
        body: formData,
      });
      const uploadBody: ApiResponse<UploadedImage[]> = await uploadRes.json();
      if (!uploadBody.success || !uploadBody.data) {
        throw new Error(uploadBody.message || "이미지 업로드에 실패했습니다.");
      }

      const uploadPhotoList = uploadBody.data.map((item) => ({
        thumbnailImageId: item.thumbnailImageFile.id,
        imageId: item.originalImageFile.id,
      }));

      const saveRes = await fetch(`${API_URL}/api/photos/${albumId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ uploadPhotoList }),
      });
      const saveBody: ApiResponse<unknown> = await saveRes.json();
      if (!saveBody.success) {
        throw new Error(saveBody.message || "사진 저장에 실패했습니다.");
      }

      pendingFiles.forEach((p) => URL.revokeObjectURL(p.previewUrl));
      setPendingFiles([]);
      await loadData();
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : "업로드에 실패했습니다.",
      );
    } finally {
      setUploading(false);
    }
  }

  async function handleDeletePhoto(photoId: number) {
    if (!accessToken || !data) return;
    if (!confirm("이 사진을 삭제할까요?")) return;

    const prevPhotos = data.photos;
    setData({ ...data, photos: data.photos.filter((p) => p.id !== photoId) });
    try {
      const res = await fetch(`${API_URL}/api/photos/${photoId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) throw new Error();
    } catch {
      setData((prev) => (prev ? { ...prev, photos: prevPhotos } : prev));
    }
  }

  async function handlePhotoDrop(index: number) {
    const from = draggingPhotoIndex;
    setDraggingPhotoIndex(null);
    setDragOverPhotoIndex(null);
    if (from === null || from === index || !data || !accessToken) return;

    const reordered = [...data.photos];
    const [moved] = reordered.splice(from, 1);
    reordered.splice(index, 0, moved);
    setData({ ...data, photos: reordered });

    try {
      await fetch(`${API_URL}/api/photos/reorder`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          albumId: Number(albumId),
          photoIds: reordered.map((p) => p.id),
        }),
      });
    } catch {
      loadData();
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <SiteHeader />
      <main className="px-3 py-6 sm:px-6">
        {loading ? null : notFound || !data ? (
          <p className="py-20 text-center text-sm text-zinc-500 dark:text-zinc-400">
            앨범을 찾을 수 없습니다.
          </p>
        ) : (
          <>
            <div className="mb-6">
              <Link
                href={`/album/${username}`}
                className="mb-2 inline-block text-sm text-zinc-500 hover:underline dark:text-zinc-400"
              >
                ← {username}님의 앨범
              </Link>
              <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                {data.title}
              </h1>
              {data.description && (
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  {data.description}
                </p>
              )}
            </div>

            {isOwner && (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOverDrop(true);
                }}
                onDragLeave={() => setDragOverDrop(false)}
                onDrop={handleDrop}
                className={`mb-6 rounded-2xl border-2 border-dashed p-6 text-center transition-colors ${
                  dragOverDrop
                    ? "border-red-500 bg-red-50 dark:bg-red-950/20"
                    : "border-zinc-300 dark:border-zinc-700"
                }`}
              >
                <label className="cursor-pointer text-sm text-zinc-500 dark:text-zinc-400">
                  사진을 여기로 끌어다 놓거나{" "}
                  <span className="font-semibold text-red-600">
                    클릭해서 선택
                  </span>
                  하세요
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleFileInputChange}
                  />
                </label>

                {pendingFiles.length > 0 && (
                  <div className="mt-4">
                    <div className="flex flex-wrap justify-center gap-2">
                      {pendingFiles.map((p, index) => (
                        <div
                          key={p.key}
                          draggable
                          onDragStart={() => setDraggingPendingIndex(index)}
                          onDragOver={(e) => {
                            e.preventDefault();
                            if (dragOverPendingIndex !== index) {
                              setDragOverPendingIndex(index);
                            }
                          }}
                          onDrop={(e) => {
                            e.preventDefault();
                            handlePendingDrop(index);
                          }}
                          onDragEnd={() => {
                            setDraggingPendingIndex(null);
                            setDragOverPendingIndex(null);
                          }}
                          className={`group relative h-20 w-20 cursor-move overflow-hidden rounded-lg border transition-all ${
                            draggingPendingIndex === index
                              ? "opacity-40"
                              : ""
                          } ${
                            dragOverPendingIndex === index &&
                            draggingPendingIndex !== index
                              ? "border-red-500 ring-2 ring-red-500 ring-offset-1"
                              : "border-zinc-200 dark:border-zinc-700"
                          }`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={p.previewUrl}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                          <span className="absolute left-1 top-1 rounded-full bg-black/60 px-1.5 text-[10px] font-semibold text-white">
                            {index + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => removePendingFile(p.key)}
                            className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100"
                            aria-label="첨부 취소"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                    <p className="mt-2 text-xs text-zinc-400">
                      드래그해서 순서를 바꿀 수 있어요
                    </p>
                    {uploadError && (
                      <p className="mt-2 text-sm text-red-600">
                        {uploadError}
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={handleUploadSubmit}
                      disabled={uploading}
                      className="mt-3 rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-60"
                    >
                      {uploading
                        ? "업로드 중..."
                        : `${pendingFiles.length}장 업로드`}
                    </button>
                  </div>
                )}
              </div>
            )}

            {data.photos.length === 0 ? (
              <p className="py-20 text-center text-sm text-zinc-500 dark:text-zinc-400">
                {isOwner
                  ? "아직 사진이 없어요. 위에서 사진을 추가해보세요!"
                  : "아직 등록된 사진이 없습니다."}
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {data.photos.map((photo, index) => (
                  <div
                    key={photo.id}
                    draggable={isOwner}
                    onDragStart={() => setDraggingPhotoIndex(index)}
                    onDragOver={(e) => {
                      if (!isOwner) return;
                      e.preventDefault();
                      if (dragOverPhotoIndex !== index) {
                        setDragOverPhotoIndex(index);
                      }
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      handlePhotoDrop(index);
                    }}
                    onDragEnd={() => {
                      setDraggingPhotoIndex(null);
                      setDragOverPhotoIndex(null);
                    }}
                    className={`group relative aspect-square overflow-hidden rounded-xl bg-zinc-100 transition-all dark:bg-zinc-900 ${
                      isOwner ? "cursor-move" : ""
                    } ${draggingPhotoIndex === index ? "opacity-40" : ""} ${
                      dragOverPhotoIndex === index &&
                      draggingPhotoIndex !== index
                        ? "ring-4 ring-red-500 ring-offset-2 ring-offset-white dark:ring-offset-black"
                        : ""
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={buildUploadFileUrl(photo.thumbnailUploadFile.url)}
                      alt={photo.title ?? ""}
                      className="h-full w-full object-cover"
                    />
                    {isOwner && (
                      <button
                        type="button"
                        onClick={() => handleDeletePhoto(photo.id)}
                        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
                        aria-label="사진 삭제"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
