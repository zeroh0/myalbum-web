"use client";

import Link from "next/link";
import { buildUploadFileUrl } from "@/app/lib/album";
import type { Photo } from "@/app/lib/photo";

export default function PhotoDetailModal({
  photo,
  albumTitle,
  albumHref,
  onClose,
}: {
  photo: Photo;
  albumTitle?: string;
  albumHref?: string;
  onClose: () => void;
}) {
  const uploadedAt = new Date(photo.createdAt).toLocaleString("ko-KR");
  const exif = photo.originUploadFile;
  const takenAt = exif.takenAt
    ? new Date(exif.takenAt).toLocaleDateString("ko-KR")
    : null;

  return (
    <div
      className="fixed inset-0 z-30 flex items-center justify-center bg-black/70 px-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-lg dark:bg-zinc-950 sm:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-1 items-center justify-center bg-black">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={buildUploadFileUrl(photo.originUploadFile.url)}
            alt={photo.title ?? ""}
            className="max-h-[70vh] w-full object-contain sm:max-h-[92vh]"
          />
        </div>

        <div className="flex w-full flex-col gap-3 p-6 sm:w-96">
          <div className="flex items-start justify-between gap-2">
            {albumHref && albumTitle ? (
              <Link
                href={albumHref}
                onClick={onClose}
                className="text-lg font-semibold text-zinc-900 hover:underline dark:text-zinc-50"
              >
                {albumTitle}
              </Link>
            ) : (
              <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                {photo.title ?? "사진"}
              </span>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="닫기"
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
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
          </div>

          {photo.description && (
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {photo.description}
            </p>
          )}

          <dl className="mt-2 flex flex-col gap-2 text-sm">
            <div className="flex justify-between gap-2">
              <dt className="text-zinc-500 dark:text-zinc-400">파일명</dt>
              <dd className="truncate text-right text-zinc-900 dark:text-zinc-50">
                {photo.originUploadFile.originFileName}
              </dd>
            </div>
            {photo.originUploadFile.width && photo.originUploadFile.height && (
              <div className="flex justify-between gap-2">
                <dt className="text-zinc-500 dark:text-zinc-400">크기</dt>
                <dd className="text-zinc-900 dark:text-zinc-50">
                  {photo.originUploadFile.width} ×{" "}
                  {photo.originUploadFile.height}
                </dd>
              </div>
            )}
            <div className="flex justify-between gap-2">
              <dt className="text-zinc-500 dark:text-zinc-400">업로드</dt>
              <dd className="text-zinc-900 dark:text-zinc-50">{uploadedAt}</dd>
            </div>
            {takenAt && (
              <div className="flex justify-between gap-2">
                <dt className="text-zinc-500 dark:text-zinc-400">촬영일</dt>
                <dd className="text-zinc-900 dark:text-zinc-50">{takenAt}</dd>
              </div>
            )}
            {exif.cameraModel && (
              <div className="flex justify-between gap-2">
                <dt className="text-zinc-500 dark:text-zinc-400">카메라</dt>
                <dd className="truncate text-right text-zinc-900 dark:text-zinc-50">
                  {exif.cameraModel}
                </dd>
              </div>
            )}
            {exif.lensModel && (
              <div className="flex justify-between gap-2">
                <dt className="text-zinc-500 dark:text-zinc-400">렌즈</dt>
                <dd className="truncate text-right text-zinc-900 dark:text-zinc-50">
                  {exif.lensModel}
                </dd>
              </div>
            )}
            {exif.iso && (
              <div className="flex justify-between gap-2">
                <dt className="text-zinc-500 dark:text-zinc-400">ISO</dt>
                <dd className="text-zinc-900 dark:text-zinc-50">{exif.iso}</dd>
              </div>
            )}
            {exif.aperture && (
              <div className="flex justify-between gap-2">
                <dt className="text-zinc-500 dark:text-zinc-400">조리개</dt>
                <dd className="text-zinc-900 dark:text-zinc-50">
                  {exif.aperture}
                </dd>
              </div>
            )}
            {exif.shutterSpeed && (
              <div className="flex justify-between gap-2">
                <dt className="text-zinc-500 dark:text-zinc-400">
                  셔터스피드
                </dt>
                <dd className="text-zinc-900 dark:text-zinc-50">
                  {exif.shutterSpeed}
                </dd>
              </div>
            )}
          </dl>

          <a
            href={buildUploadFileUrl(photo.originUploadFile.url)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto inline-block rounded-full border border-zinc-300 px-4 py-2 text-center text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            원본 이미지 새 탭에서 보기
          </a>
        </div>
      </div>
    </div>
  );
}
