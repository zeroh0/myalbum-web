import SiteHeader from "@/app/components/SiteHeader";
import PinterestGrid from "@/app/components/PinterestGrid";
import { photos } from "@/app/lib/photos";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <SiteHeader />
      <main className="px-3 py-6 sm:px-6">
        <PinterestGrid photos={photos} />
      </main>
    </div>
  );
}
