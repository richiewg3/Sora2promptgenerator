import { getAIConfig, diagnostics } from "./_lib/ai-client.js";

export default async function handler(req, res) {
  try {
    const config = await getAIConfig();
    const diag = diagnostics(config);

    res.status(200).json({
      success: true,
      timestamp: new Date().toISOString(),
      nodeVersion: process.version,
      ...diag,
    });
  } catch (err) {
    // No key configured at all
    res.status(500).json({
      success: false,
      timestamp: new Date().toISOString(),
      nodeVersion: process.version,
      error: err.message,
      providerMode: null,
      baseURLUsed: null,
      modelUsed: null,
      keySource: null,
      hasKey: false,
      keyPrefix: null,
    });
  }
}
