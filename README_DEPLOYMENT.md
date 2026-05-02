# 🚀 Deployment Guide for Tasky

This project is configured for a **MERN Stack** deployment using **Vercel** (Frontend) and **Render** (Backend).

## 1. Backend (Render)
- **Service Type**: Web Service
- **Root Directory**: `server`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Environment Variables**:
  - `MONGODB_URI`: Your MongoDB connection string
  - `JWT_SECRET`: A random secure string
  - `NODE_ENV`: `production`
  - `FRONTEND_URL`: Your Vercel app URL (e.g., `https://tasky-one-iota.vercel.app`)

## 2. Frontend (Vercel)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables**:
  - `VITE_APP_BASE_URL`: Your Render backend URL

## ⚠️ Fix for "Permission Denied"
I have updated the root `build` script to automatically fix permissions for `vite`. 
If it still fails:
1. Go to Vercel -> Deployments -> Redeploy.
2. Select **"Reset Build Cache"**.

## 🛠️ Fixes Applied
1. **CORS Fix**: Backend now allows Vercel origin.
2. **Permission Fix**: Added `chmod +x` to the build script to fix Vite execution errors.
3. **Clean Repo**: `node_modules` are no longer tracked.
