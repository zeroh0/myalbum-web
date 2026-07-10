export default function GlobalLoadingOverlay() {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40"
      role="status"
      aria-live="polite"
      aria-label="처리 중"
    >
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/30 border-t-white" />
    </div>
  );
}
