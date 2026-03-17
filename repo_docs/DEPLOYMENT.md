# 🚀 Deploying Limbraapp to Vercel

## Prerequisites
- GitHub account
- Vercel account (sign up at https://vercel.com)
- HuggingFace Write Access Token

## Step 1: Push to GitHub

```bash
git add .
git commit -m "Add Vercel serverless function for StretchGPT V3"
git push origin main
```

## Step 2: Import to Vercel

1. Go to https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. Select your **Limbraapp** repository from GitHub
4. Click **"Import"**

## Step 3: Configure Build Settings

Vercel should auto-detect these settings:
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

## Step 4: Add Environment Variables

In the Vercel project settings:

1. Go to **Settings** → **Environment Variables**
2. Add the following variable:

| Key | Value | Environment |
|-----|-------|-------------|
| `HF_WRITE_TOKEN` | Your HuggingFace token | Production, Preview, Development |

**To get your HuggingFace token:**
- Go to https://huggingface.co/settings/tokens
- Create a new token with **Write** access
- Copy and paste it into Vercel

## Step 5: Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes for build to complete
3. Vercel will provide you with a URL like: `https://limbraapp.vercel.app`

## Step 6: Test Your Deployment

1. Open your Vercel URL
2. Click **Settings** in the app
3. Your HuggingFace token field can be left empty (it's now on the server!)
4. Set **AI Provider** to **"stretchgpt"**
5. Generate a routine - it should now use your V3 model!

## Troubleshooting

### Error: "HuggingFace token not configured on server"
- Make sure you added `HF_WRITE_TOKEN` to Vercel environment variables
- Redeploy after adding the variable

### Error: "Failed to reach StretchGPT V3"
- Check that your HuggingFace model is deployed: https://huggingface.co/dkumi12/stretchgptv2
- Verify your token has Write access

### Error: "Serverless function timeout"
- HuggingFace inference might need warm-up time
- Try generating again after 30 seconds

## Local Development

To test the serverless function locally:

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Run dev server:
```bash
vercel dev
```

3. Access at: http://localhost:3000

## Architecture Overview

```
Browser → /api/generate (Vercel Function) → HuggingFace API
   ↑                                              ↓
   └──────────── JSON Response ←──────────────────┘
```

✅ **No CORS issues** - Same origin
✅ **Secure** - API token stays on server
✅ **Scalable** - Serverless auto-scales

## Next Steps

- [ ] Test V3 model generation
- [ ] Monitor usage in HuggingFace dashboard
- [ ] Add OpenRouter fallback (optional)
- [ ] Configure custom domain (optional)
