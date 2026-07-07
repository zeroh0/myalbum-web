"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import TextField from "@/app/components/TextField";
import { useAuth } from "@/app/lib/auth-context";
import type { ApiResponse } from "@/app/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export default function CreateAlbumModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const { accessToken } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleCoverChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setCoverFile(file);
    setCoverPreview(file ? URL.createObjectURL(file) : null);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("앨범 제목을 입력해주세요.");
      return;
    }
    if (!accessToken) {
      setError("로그인 정보가 확인되지 않았습니다. 다시 로그인해주세요.");
      return;
    }

    setSubmitting(true);
    try {
      let uploadFileId: number | null = null;
      if (coverFile) {
        const formData = new FormData();
        formData.append("file", coverFile);
        const uploadRes = await fetch(`${API_URL}/api/upload`, {
          method: "POST",
          headers: { Authorization: `Bearer ${accessToken}` },
          body: formData,
        });
        const uploadBody: ApiResponse<{ id: number }> = await uploadRes.json();
        if (!uploadBody.success || !uploadBody.data) {
          throw new Error(uploadBody.message || "이미지 업로드에 실패했습니다.");
        }
        uploadFileId = uploadBody.data.id;
      }

      const res = await fetch(`${API_URL}/api/album`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          title,
          description,
          saveUploadFileRequest: { id: uploadFileId },
        }),
      });
      const body: ApiResponse<{ id: number }> = await res.json();
      if (!body.success) {
        throw new Error(body.message || "앨범 생성에 실패했습니다.");
      }
      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "앨범 생성에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-20 flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg dark:bg-zinc-950"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          앨범 생성
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="mx-auto flex h-28 w-28 cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-dashed border-zinc-300 bg-zinc-50 text-center text-xs text-zinc-400 dark:border-zinc-700 dark:bg-zinc-900">
            {coverPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={coverPreview}
                alt="커버 미리보기"
                className="h-full w-full object-cover"
              />
            ) : (
              "커버 이미지\n(선택)"
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverChange}
              className="hidden"
            />
          </label>

          <TextField
            id="album-title"
            label="제목"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="앨범 제목"
          />

          <div>
            <label
              htmlFor="album-description"
              className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              설명
            </label>
            <textarea
              id="album-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="앨범 설명 (선택)"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="h-11 flex-1 rounded-full border border-zinc-300 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="h-11 flex-1 rounded-full bg-red-600 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-60"
            >
              {submitting ? "생성 중..." : "생성"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
