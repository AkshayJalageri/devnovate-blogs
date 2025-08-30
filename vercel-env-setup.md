# 🚀 Vercel Environment Variables Setup

## **IMPORTANT: You MUST set these environment variables in Vercel!**

The "failed to fetch blogs" error is happening because Vercel doesn't have the `VITE_API_URL` environment variable set.

## **Step-by-Step Setup:**

### 1. **Go to Vercel Dashboard**
- Visit: https://vercel.com/dashboard
- Find your project: `devnovate-blogs`

### 2. **Navigate to Environment Variables**
- Click on your project
- Go to **Settings** tab
- Click **Environment Variables** in the left sidebar

### 3. **Add Environment Variable**
- **Name**: `VITE_API_URL`
- **Value**: `https://devnovate-blogs-api.onrender.com/api`
- **Environment**: Select **Production** and **Preview**
- Click **Add**

### 4. **Redeploy**
- After adding the environment variable, Vercel will automatically redeploy
- Or you can manually trigger a redeploy from the **Deployments** tab

## **What This Fixes:**

✅ **"Failed to fetch blogs" error** - API calls will go to the correct backend  
✅ **Registration issues** - Auth endpoints will work properly  
✅ **All API calls** - Frontend will communicate with Render backend  

## **Alternative: Use Vercel CLI**

If you prefer command line:

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Add environment variable
vercel env add VITE_API_URL

# When prompted, enter: https://devnovate-blogs-api.onrender.com/api
```

## **Verify Setup:**

After setting the environment variable:

1. **Wait for Vercel to redeploy** (1-3 minutes)
2. **Open your app**: https://devnovate-blogs-mu.vercel.app
3. **Check browser console** - Should see API configuration logs
4. **No more "failed to fetch blogs"** error
5. **Registration should work** properly

## **Why This Happened:**

- Vercel doesn't automatically read `.env` files
- Without `VITE_API_URL`, the app falls back to production URL
- But there might be a mismatch in the fallback logic
- Setting the environment variable ensures the correct backend URL is used

## **Need Help?**

If you still see issues after setting the environment variable:

1. **Check Vercel deployment logs** for any build errors
2. **Open browser console** to see API configuration logs
3. **Verify the environment variable** is set correctly in Vercel dashboard

---

**🎯 This should fix both the "failed to fetch blogs" and registration issues!**
