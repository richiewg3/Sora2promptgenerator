import { useEffect, useState } from "react";
import ImageUpload from "./components/ImageUpload.jsx";
import PromptInput from "./components/PromptInput.jsx";
import GenerateButton from "./components/GenerateButton.jsx";
import OutputDisplay from "./components/OutputDisplay.jsx";
import ErrorMessage from "./components/ErrorMessage.jsx";

const MIN_PROMPT_LENGTH = 10;

const emptyImageState = {
  dataUrl: "",
  fileName: "",
};

export default function App() {
  const [imageState, setImageState] = useState(emptyImageState);
  const [initialPrompt, setInitialPrompt] = useState("");
  const [specificGoals, setSpecificGoals] = useState("");
  const [enhancedPrompt, setEnhancedPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [resetSignal, setResetSignal] = useState(0);

  const canGenerate =
    Boolean(imageState.dataUrl) &&
    initialPrompt.trim().length >= MIN_PROMPT_LENGTH;

  const handleFileSelected = (file, validation) => {
    const { acceptedTypes, maxSize } = validation;
    if (isLoading) return;
    setErrorMessage("");
    setSuccessMessage("");

    if (!acceptedTypes.includes(file.type)) {
      setErrorMessage("Please upload a JPG, PNG, or WebP image.");
      return;
    }

    if (file.size > maxSize) {
      setErrorMessage("Image must be 10MB or less.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") return;
      setImageState({
        dataUrl: reader.result,
        fileName: file.name,
      });
    };
    reader.onerror = () => {
      setErrorMessage("Could not read that file, try another image.");
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!imageState.dataUrl) {
      setErrorMessage("Please upload an image before generating.");
      return;
    }

    if (initialPrompt.trim().length < MIN_PROMPT_LENGTH) {
      setErrorMessage("Initial prompt must be at least 10 characters.");
      return;
    }

    setIsLoading(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch("/api/enhance-prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: imageState.dataUrl,
          initialPrompt: initialPrompt.trim(),
          specificGoals: specificGoals.trim(),
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data?.success) {
        throw new Error(data?.error || "Unexpected error, try again");
      }

      setEnhancedPrompt(data.enhancedPrompt || "");
    } catch (error) {
      if (error?.name === "AbortError") {
        setErrorMessage("Request timed out, try again");
      } else {
        setErrorMessage(error?.message || "Unexpected error, try again");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!enhancedPrompt) return;
    try {
      await navigator.clipboard.writeText(enhancedPrompt);
      setSuccessMessage("Copied to clipboard.");
    } catch (error) {
      setErrorMessage("Copy failed, please try again.");
    }
  };

  const handleReset = () => {
    setImageState(emptyImageState);
    setInitialPrompt("");
    setSpecificGoals("");
    setEnhancedPrompt("");
    setErrorMessage("");
    setSuccessMessage("");
    setResetSignal((value) => value + 1);
  };

  useEffect(() => {
    if (!successMessage) return;
    const timeoutId = setTimeout(() => setSuccessMessage(""), 2500);
    return () => clearTimeout(timeoutId);
  }, [successMessage]);

  return (
    <main className="min-h-screen bg-[#0f0f0f] text-[#f5f5f5]">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-4 py-10">
        <header className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6366f1]">
            Sora 2 Prompt Enhancer
          </p>
          <h1 className="text-2xl font-semibold md:text-3xl">
            Transform your image into a production-ready Sora 2 prompt
          </h1>
          <p className="max-w-3xl text-sm text-[#a0a0a0]">
            Upload a reference image, describe your vision, and let the
            enhancer craft a cinematic prompt that follows the Sora 2
            instruction framework.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-[1.05fr_1fr]">
          <ImageUpload
            previewUrl={imageState.dataUrl}
            fileName={imageState.fileName}
            onFileSelected={handleFileSelected}
            resetSignal={resetSignal}
          />

          <div className="rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] p-6">
            <PromptInput
              initialPrompt={initialPrompt}
              specificGoals={specificGoals}
              onInitialPromptChange={setInitialPrompt}
              onSpecificGoalsChange={setSpecificGoals}
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <GenerateButton
            disabled={!canGenerate}
            loading={isLoading}
            onClick={handleGenerate}
          />
          <button
            type="button"
            onClick={handleReset}
            disabled={isLoading}
            className={`inline-flex w-full items-center justify-center rounded-lg border px-5 py-3 text-base font-semibold transition md:w-auto ${
              isLoading
                ? "cursor-not-allowed border-[#2a2a2a] text-[#6f6f6f]"
                : "border-[#2a2a2a] text-[#f5f5f5] hover:border-[#6366f1]"
            }`}
          >
            Clear / Reset
          </button>
        </div>

        <div className="space-y-3">
          <ErrorMessage message={errorMessage} variant="error" />
          <ErrorMessage message={successMessage} variant="success" />
        </div>

        <OutputDisplay output={enhancedPrompt} onCopy={handleCopy} />
      </div>
    </main>
  );
}
