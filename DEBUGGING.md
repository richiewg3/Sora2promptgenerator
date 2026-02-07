# Debugging API Key Errors

## Quick Diagnosis Steps

### 1. Check Health Endpoint
After your Vercel deployment completes, visit:
```
https://your-app.vercel.app/api/health
```

This will show:
- Whether the API key environment variable is set
- The first 7 characters of your API key (to verify it's correct)
- Node.js version

### 2. Verify Vercel Environment Variables

Go to your Vercel project:
1. Navigate to **Settings** → **Environment Variables**
2. Verify `OPENAI_API_KEY` is set
3. Make sure it's enabled for the correct environment (Production/Preview/Development)
4. **Important**: After changing environment variables, you must **redeploy** for changes to take effect

### 3. Check API Key Format

OpenAI API keys should:
- Start with `sk-proj-` (project keys) or `sk-` (legacy keys)
- Be exactly 51-56 characters long
- Have no extra spaces or line breaks

### 4. Verify API Key Permissions

Make sure your OpenAI API key has:
- Access to the GPT-4o model (or whichever model you're using)
- Sufficient credits/quota
- Not been revoked or expired

### 5. Check Vercel Logs

View real-time logs:
```bash
vercel logs <your-deployment-url> --follow
```

Or in Vercel Dashboard:
1. Go to your project
2. Click on the deployment
3. Click "Logs" tab
4. Try to use the app and watch for errors

### 6. Common Issues

**"Configuration error"** = API key not found in environment variables
- Solution: Set `OPENAI_API_KEY` in Vercel and redeploy

**"Too many requests"** = Rate limit exceeded
- Solution: Wait a few minutes or upgrade your OpenAI plan

**"Unexpected error"** = Generic error (check logs for details)
- Could be: Invalid model name, network timeout, API quota exceeded

### 7. Test the API Key Directly

You can test if your API key works:
```bash
curl https://api.openai.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{"model": "gpt-4o", "messages": [{"role": "user", "content": "test"}], "max_tokens": 5}'
```

If this returns an error, the issue is with your API key, not the app.

## Need More Help?

Check the Vercel deployment logs for detailed error messages. The app now includes enhanced logging to help identify the exact issue.
