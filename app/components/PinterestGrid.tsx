import { buildUploadFileUrl } from "@/app/lib/album";
import type { Photo } from "@/app/lib/photo";

export default function PinterestGrid({
  photos,
  onSelect,
}: {
  photos: Photo[];
  onSelect: (photo: Photo) => void;
}) {
  return (
    <div className="columns-2 gap-4 sm:columns-3 lg:columns-4 xl:columns-5 [column-fill:_balance]">
      {photos.map((photo) => (
        <figure
          key={photo.id}
          onClick={() => onSelect(photo)}
          className="group relative mb-4 cursor-pointer break-inside-avoid overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-900"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={buildUploadFileUrl(photo.thumbnailUploadFile.url)}
            alt={photo.title ?? ""}
            width={photo.thumbnailUploadFile.width ?? 800}
            height={photo.thumbnailUploadFile.height ?? 800}
            className="h-auto w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
        </figure>
      ))}
    </div>
  );
}
