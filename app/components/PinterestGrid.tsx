import Image from "next/image";
import type { Photo } from "@/app/lib/photos";

export default function PinterestGrid({ photos }: { photos: Photo[] }) {
  return (
    <div className="columns-2 gap-4 sm:columns-3 lg:columns-4 xl:columns-5 [column-fill:_balance]">
      {photos.map((photo) => (
        <figure
          key={photo.id}
          className="group relative mb-4 break-inside-avoid overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-900"
        >
          <Image
            src={photo.src}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
            className="h-auto w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
          <button
            type="button"
            className="absolute right-3 top-3 translate-y-1 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white opacity-0 shadow-md transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 hover:bg-red-700"
          >
            저장
          </button>
        </figure>
      ))}
    </div>
  );
}
