import { useEffect, useRef, useState } from "react";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 10 * 1024 * 1024;

export default function ImageUpload({
  previewUrl,
  fileName,
  onFileSelected,
  resetSignal,
}) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }, [resetSignal]);

  const handleFiles = (files) => {
    const file = files?.[0];
    if (!file) return;
    onFileSelected(file, { acceptedTypes: ACCEPTED_TYPES, maxSize: MAX_SIZE });
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    handleFiles(event.dataTransfer.files);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  return (
    <div className="space-y-4">
      <div
        className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition ${
          isDragging
            ? "border-[#6366f1] bg-[#141427]"
            : "border-[#2a2a2a] bg-[#1a1a1a]"
        }`}
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            inputRef.current?.click();
          }
        }}
      >
        <div className="mb-3 rounded-full border border-[#2a2a2a] p-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-[#a0a0a0]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M3 16.5V19a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2.5M7 10l5-5m0 0 5 5m-5-5v12"
            />
          </svg>
        </div>
        <p className="text-sm font-medium text-[#f5f5f5]">
          Drag image here or click to upload
        </p>
        <p className="mt-2 text-xs text-[#a0a0a0]">
          JPG, PNG, WebP · Max 10MB
        </p>
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept={ACCEPTED_TYPES.join(",")}
          onChange={(event) => handleFiles(event.target.files)}
        />
      </div>

      {previewUrl && (
        <div className="rounded-xl border border-[#2a2a2a] bg-[#0a0a0a] p-4">
          <p className="mb-3 text-xs uppercase tracking-wide text-[#a0a0a0]">
            Preview
          </p>
          <img
            src={previewUrl}
            alt={fileName || "Uploaded preview"}
            className="max-h-[300px] w-full max-w-[300px] rounded-lg object-contain"
          />
          {fileName && (
            <p className="mt-2 text-xs text-[#a0a0a0]">{fileName}</p>
          )}
        </div>
      )}
    </div>
  );
}
