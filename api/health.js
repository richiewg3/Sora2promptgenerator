export default async function handler(req, res) {
  const hasApiKey = !!process.env.OPENAI_API_KEY;
  const apiKeyPrefix = hasApiKey 
    ? process.env.OPENAI_API_KEY.substring(0, 7) + "..." 
    : "NOT SET";

  res.status(200).json({
    success: true,
    timestamp: new Date().toISOString(),
    environment: {
      hasApiKey,
      apiKeyPrefix,
      nodeVersion: process.version,
    },
  });
}
