import OpenAI from "openai";

/**
 * Resolves the AI client configuration.
 *
 * Priority:
 *  1. AI_GATEWAY_API_KEY  → Vercel AI Gateway (OpenAI-compatible)
 *  2. OPENAI_API_KEY      → OpenAI direct
 *
 * Returns { client, providerMode, baseURLUsed, keySource, apiKeyPrefix }
 */
export function getClient() {
  const gatewayKey = process.env.AI_GATEWAY_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  let apiKey, baseURLUsed, providerMode, keySource;

  if (gatewayKey) {
    apiKey = gatewayKey;
    baseURLUsed = "https://ai-gateway.vercel.sh/v1";
    providerMode = "gateway";
    keySource = "AI_GATEWAY_API_KEY";
  } else if (openaiKey) {
    apiKey = openaiKey;
    baseURLUsed = undefined; // OpenAI SDK default
    providerMode = "openai";
    keySource = "OPENAI_API_KEY";
  } else {
    throw new Error("Missing AI_GATEWAY_API_KEY or OPENAI_API_KEY");
  }

  const clientOptions = {
    apiKey,
    timeout: 30000,
  };
  if (baseURLUsed) {
    clientOptions.baseURL = baseURLUsed;
  }

  const client = new OpenAI(clientOptions);

  return {
    client,
    providerMode,
    baseURLUsed: baseURLUsed || "https://api.openai.com/v1",
    keySource,
    apiKeyPrefix: apiKey.substring(0, 6) + "...",
  };
}

// ── Model preference lists ──────────────────────────────────────────

const GATEWAY_PREFERRED = [
  "openai/gpt-5.2",
  "openai/gpt-5",
  "openai/gpt-5-mini",
  "openai/gpt-4o",
  "openai/gpt-4.1",
];
const OPENAI_PREFERRED = ["gpt-5.2", "gpt-5", "gpt-5-mini", "gpt-4o", "gpt-4.1"];

const GATEWAY_FALLBACK = "openai/gpt-4o";
const OPENAI_FALLBACK = "gpt-4o";

/**
 * Resolves the model to use.
 *
 * 1. If AI_MODEL env var is set → use verbatim.
 * 2. Else call client.models.list() and pick best available.
 * 3. If list fails → use safe fallback.
 *
 * @param {OpenAI}  client
 * @param {string}  providerMode  "gateway" | "openai"
 * @returns {Promise<string>} resolved model id
 */
export async function resolveModel(client, providerMode) {
  // 1. Explicit override
  if (process.env.AI_MODEL) {
    return process.env.AI_MODEL;
  }

  const preferred = providerMode === "gateway" ? GATEWAY_PREFERRED : OPENAI_PREFERRED;
  const fallback = providerMode === "gateway" ? GATEWAY_FALLBACK : OPENAI_FALLBACK;
  const prefix = providerMode === "gateway" ? "openai/" : "gpt-";

  // 2. Try dynamic resolution
  try {
    const list = await client.models.list();
    const ids = new Set();
    for await (const model of list) {
      ids.add(model.id);
    }

    // Pick the first preferred model that exists
    for (const candidate of preferred) {
      if (ids.has(candidate)) {
        return candidate;
      }
    }

    // Otherwise pick any model that starts with the right prefix
    for (const id of ids) {
      if (id.startsWith(prefix)) {
        return id;
      }
    }
  } catch (err) {
    console.warn(`[ai-client] models.list() failed (${err.message}), using fallback model`);
  }

  // 3. Fallback
  return fallback;
}

/**
 * Convenience: returns everything needed by API routes.
 *
 * { client, providerMode, baseURLUsed, modelUsed, keySource, apiKeyPrefix }
 */
export async function getAIConfig() {
  const { client, providerMode, baseURLUsed, keySource, apiKeyPrefix } = getClient();
  const modelUsed = await resolveModel(client, providerMode);
  return { client, providerMode, baseURLUsed, modelUsed, keySource, apiKeyPrefix };
}

/**
 * Returns a safe-to-log diagnostics object (no secrets).
 */
export function diagnostics({ providerMode, baseURLUsed, modelUsed, keySource, apiKeyPrefix }) {
  return {
    providerMode,
    baseURLUsed,
    modelUsed,
    keySource,
    hasKey: true,
    keyPrefix: apiKeyPrefix,
  };
}
