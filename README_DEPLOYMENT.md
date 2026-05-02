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
- **Root Directory**: `client` (OR keep root and Vercel will use the root `build` script)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables**:
  - `VITE_APP_BASE_URL`: Your Render backend URL (e.g., `https://tasky-api.onrender.com`)

## ⚠️ Fix for "Permission Denied" Error
If you see a `Permission denied` error for `vite` on Vercel, it means there are still old `node_modules` in the Vercel cache. 
**To fix this**:
1. Go to your project on Vercel.
2. Go to the **Deployments** tab.
3. Click on the three dots (...) next to the latest deployment.
4. Select **"Redeploy"**.
5. **CRITICAL**: Make sure to check the box **"Reset Build Cache"** before clicking Redeploy.

## 🛠️ Fixes Applied
1. **CORS Fix**: The backend now dynamically allows your Vercel URL.
2. **Build Delegation**: Added a root `build` script so Vercel can find the client build from the root directory.
3. **Git Hygiene**: `node_modules` have been removed from tracking. 
