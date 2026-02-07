import { getClient } from "./_lib/ai-client.js";

export default async function handler(req, res) {
  try {
    const { client, providerMode, baseURLUsed, keySource, apiKeyPrefix } = getClient();

    const list = await client.models.list();
    const ids = [];
    for await (const model of list) {
      ids.push(model.id);
    }

    ids.sort();

    res.status(200).json({
      success: true,
      providerMode,
      baseURLUsed,
      keySource,
      keyPrefix: apiKeyPrefix,
      count: ids.length,
      models: ids,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
}
