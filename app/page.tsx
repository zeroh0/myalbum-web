import PinterestGrid from "@/app/components/PinterestGrid";
import { photos } from "@/app/lib/photos";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/80 px-4 py-4 backdrop-blur-md dark:border-zinc-800 dark:bg-black/80 sm:px-8">
        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
          MyAlbum
        </h1>
      </header>
      <main className="px-3 py-6 sm:px-6">
        <PinterestGrid photos={photos} />
      </main>
    </div>
  );
}
