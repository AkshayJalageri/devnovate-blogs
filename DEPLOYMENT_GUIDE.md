# Deployment Guide for Devnovate Blogs

This guide will help you deploy your MERN stack application with the frontend on Vercel and backend on Render.

## 🚀 Backend Deployment (Render)

### 1. Deploy Backend to Render

1. **Push your code to GitHub** (if not already done)
2. **Go to [Render.com](https://render.com)** and sign in
3. **Create a new Web Service**
4. **Connect your GitHub repository**
5. **Configure the service:**
   - **Name**: `devnovate-blogs-api` (or your preferred name)
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: `Node 18` or higher

### 2. Set Environment Variables in Render

Add these environment variables in your Render service:

```
NODE_ENV=production
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=10000
```

### 3. Deploy and Get Your Backend URL

- Click **Create Web Service**
- Wait for deployment to complete
- Copy your backend URL (e.g., `https://devnovate-blogs-api.onrender.com`)

## 🌐 Frontend Deployment (Vercel)

### 1. Deploy Frontend to Vercel

1. **Go to [Vercel.com](https://vercel.com)** and sign in
2. **Import your GitHub repository**
3. **Configure the project:**
   - **Framework Preset**: `Vite`
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### 2. Set Environment Variables in Vercel

Add this environment variable in your Vercel project:

```
VITE_API_URL=https://devnovate-blogs-api.onrender.com/api
```

**Important**: Replace `devnovate-blogs-api.onrender.com` with your actual Render backend URL.

### 3. Deploy

- Click **Deploy**
- Wait for deployment to complete
- Your frontend will be available at your Vercel URL

## 🔧 Configuration Files

### Vercel Configuration (`client/vercel.json`)

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Environment Variables

#### Frontend (Vercel)
```
VITE_API_URL=https://your-backend-url.onrender.com/api
```

#### Backend (Render)
```
NODE_ENV=production
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=10000
ALLOWED_ORIGINS=https://your-frontend-url.vercel.app
```

## 🚨 Common Issues and Solutions

### 1. CORS Errors

**Problem**: Frontend can't connect to backend due to CORS restrictions.

**Solution**: 
- Ensure your backend URL is in the `allowedOrigins` array in `server/server.js`
- Add your Vercel domain to Render's environment variables: `ALLOWED_ORIGINS=https://your-app.vercel.app`

### 2. API Connection Issues

**Problem**: Frontend shows "Cannot connect to server" errors.

**Solution**:
- Verify `VITE_API_URL` is set correctly in Vercel
- Check that your backend is running and accessible
- Test your backend URL directly in browser: `https://your-backend.onrender.com/health`

### 3. Build Failures

**Problem**: Vercel build fails during deployment.

**Solution**:
- Ensure all dependencies are in `package.json`
- Check that `node_modules` is in `.gitignore`
- Verify the build command is correct: `npm run build`

### 4. Environment Variables Not Working

**Problem**: Frontend can't read environment variables.

**Solution**:
- Ensure all environment variables start with `VITE_` for Vite
- Redeploy after adding environment variables
- Check Vercel dashboard for environment variable configuration

## 🔍 Testing Your Deployment

### 1. Test Backend Health
```
GET https://your-backend.onrender.com/health
```

### 2. Test Frontend-Backend Connection
- Open your Vercel app
- Try to register/login
- Check browser console for any errors
- Verify API calls are going to the correct backend URL

### 3. Check CORS
- Open browser dev tools
- Look for CORS errors in the console
- Verify the `Origin` header in network requests

## 📝 Troubleshooting Checklist

- [ ] Backend deployed successfully on Render
- [ ] Frontend deployed successfully on Vercel
- [ ] Environment variables set correctly in both platforms
- [ ] MongoDB connection working
- [ ] CORS configuration allows your Vercel domain
- [ ] API endpoints responding correctly
- [ ] Frontend can make successful API calls
- [ ] Authentication working (login/register)
- [ ] Blog CRUD operations working

## 🆘 Getting Help

If you encounter issues:

1. **Check Render logs** for backend errors
2. **Check Vercel build logs** for frontend issues
3. **Verify environment variables** are set correctly
4. **Test API endpoints** directly using Postman or curl
5. **Check browser console** for frontend errors
6. **Verify CORS configuration** allows your domains

## 🔄 Updating Your Deployment

To update your deployed application:

1. **Push changes to GitHub**
2. **Render will automatically redeploy** the backend
3. **Vercel will automatically redeploy** the frontend
4. **No manual intervention required** for most changes

---

**Note**: Always test your application locally before deploying to ensure everything works correctly.
