export default function ErrorMessage({ message, variant = "error" }) {
  if (!message) {
    return null;
  }

  const isSuccess = variant === "success";

  return (
    <div
      className={`rounded-md border px-4 py-2 text-sm ${
        isSuccess
          ? "border-[#10b981] text-[#10b981] bg-[#0c1f19]"
          : "border-[#ef4444] text-[#ef4444] bg-[#1f0c0c]"
      }`}
    >
      <pre className="whitespace-pre-wrap font-sans">{message}</pre>
    </div>
  );
}
