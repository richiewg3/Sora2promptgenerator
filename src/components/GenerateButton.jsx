export default function GenerateButton({ disabled, loading, onClick }) {
  const isBlocked = disabled || loading;
  const usePrimary = !disabled || loading;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isBlocked}
      className={`inline-flex w-full items-center justify-center gap-2 rounded-lg px-5 py-3 text-base font-semibold text-white transition md:w-auto ${
        usePrimary
          ? "bg-[#6366f1] hover:bg-[#4f46e5]"
          : "cursor-not-allowed bg-[#2a2a2a] text-[#6f6f6f]"
      }`}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/70 border-t-transparent" />
      )}
      {loading ? "Generating..." : "Generate Enhanced Prompt"}
    </button>
  );
}
