export default function OutputDisplay({ output, onCopy }) {
  const hasOutput = Boolean(output);

  return (
    <div className="relative rounded-xl border border-[#2a2a2a] bg-[#0a0a0a] p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[#f5f5f5]">
          Enhanced Prompt
        </h2>
        <button
          type="button"
          onClick={onCopy}
          disabled={!hasOutput}
          className={`rounded-md border px-3 py-1 text-xs font-semibold transition ${
            hasOutput
              ? "border-[#6366f1] text-[#6366f1] hover:bg-[#1a1a2e]"
              : "cursor-not-allowed border-[#2a2a2a] text-[#6f6f6f]"
          }`}
        >
          Copy to Clipboard
        </button>
      </div>
      <div className="mt-4 min-h-[180px] whitespace-pre-wrap rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] p-4 font-mono text-sm text-[#f5f5f5]">
        {hasOutput ? (
          output
        ) : (
          <span className="text-[#6f6f6f]">
            Your enhanced prompt will appear here.
          </span>
        )}
      </div>
    </div>
  );
}
