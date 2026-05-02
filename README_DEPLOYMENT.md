# 🚀 Deployment Guide for Tasky

This project is configured for a **MERN Stack** deployment using **Vercel** (Frontend) and **Render** (Backend).

## 1. Backend (Render)
- **Service Type**: Web Service
- **Root Directory**: `server`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Environment Variables**:
  - `PORT`: `5055` (or any)
  - `MONGODB_URI`: Your MongoDB connection string
  - `JWT_SECRET`: A random secure string
  - `NODE_ENV`: `production`
  - `FRONTEND_URL`: Your Vercel app URL (e.g., `https://tasky-one-iota.vercel.app`)

## 2. Frontend (Vercel)
- **Framework Preset**: Vite
- **Root Directory**: `client`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables**:
  - `VITE_APP_BASE_URL`: Your Render backend URL (e.g., `https://tasky-api.onrender.com`)

## 🛠️ Common Fixes Applied
1. **CORS Fix**: The backend now dynamically allows your Vercel URL and localhost.
2. **Build Error Fix**: The client `package.json` was updated to correctly run `vite build`.
3. **Git Cleanup**: Removed `node_modules` from git history to prevent deployment timeouts and storage issues.
4. **Cookie Fix**: Enabled `secure: true` and `sameSite: "None"` for cross-domain authentication.

---
**Note**: Ensure that the `FRONTEND_URL` on Render and `VITE_APP_BASE_URL` on Vercel match your actual deployed URLs.
