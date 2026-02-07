export default function PromptInput({
  initialPrompt,
  specificGoals,
  onInitialPromptChange,
  onSpecificGoalsChange,
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-semibold text-[#f5f5f5]">
          Initial Prompt <span className="text-[#ef4444]">*</span>
        </label>
        <textarea
          value={initialPrompt}
          onChange={(event) => onInitialPromptChange(event.target.value)}
          placeholder="Describe the video you want to generate..."
          className="min-h-[140px] w-full rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] px-3 py-3 text-sm text-[#f5f5f5] placeholder:text-[#6f6f6f] focus:border-[#6366f1] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/40"
        />
        <p className="text-xs text-[#a0a0a0]">
          Minimum 10 characters. Be specific about the story or action.
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-[#f5f5f5]">
          Specific Goals <span className="text-[#a0a0a0]">(optional)</span>
        </label>
        <textarea
          value={specificGoals}
          onChange={(event) => onSpecificGoalsChange(event.target.value)}
          placeholder="Add constraints like duration, mood, camera style..."
          className="min-h-[120px] w-full rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] px-3 py-3 text-sm text-[#f5f5f5] placeholder:text-[#6f6f6f] focus:border-[#6366f1] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/40"
        />
        <p className="text-xs text-[#a0a0a0]">
          Optional details to guide the enhanced prompt.
        </p>
      </div>
    </div>
  );
}
