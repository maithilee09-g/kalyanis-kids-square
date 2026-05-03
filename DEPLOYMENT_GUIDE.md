# 🚀 Kalyani's Kids Square Deployment Guide

## Step 1 — Push to GitHub

1. Create a new repository on [github.com](https://github.com/new) — name it `kalyanis-kids-square`
2. Open your terminal in the main project folder (`AD`) and run:

```bash
git init
git add .
git commit -m "feat: Kalyani's Kids Square v1.0 — first edition"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/kalyanis-kids-square.git
git push -u origin main
```

---

## Step 2 — Deploy Backend on Render

1. Go to [render.com](https://render.com) → Sign up free → **New → Web Service**
2. Connect your GitHub repo (`kalyanis-kids-square`)
3. Set these settings:
   - **Root Directory**: `baby-showroom/backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Add **Environment Variables** (copy from your `baby-showroom/backend/.env`):

| Key | Value |
|---|---|
| `MONGO_URI` | your MongoDB Atlas URI |
| `CLOUDINARY_CLOUD_NAME` | your Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | your key |
| `CLOUDINARY_API_SECRET` | your secret |
| `RAZORPAY_KEY_ID` | your Razorpay key ID |
| `RAZORPAY_KEY_SECRET` | your Razorpay key secret |
| `FRONTEND_URL` | *(add this AFTER you deploy to Vercel)* |

5. Click **Deploy** → Wait ~2 min → Copy your Backend URL (e.g., `https://kalyanis-backend.onrender.com`)

---

## Step 3 — Deploy Frontend on Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project** → Import GitHub repo
2. Settings (Vercel should auto-detect Create React App):
   - **Framework Preset**: Create React App
   - **Root Directory**: `baby-ui`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
3. Add **Environment Variable**:

| Key | Value |
|---|---|
| `REACT_APP_API_URL` | `https://kalyanis-backend.onrender.com` *(Replace with your actual Render URL)* |

4. Click **Deploy** → Get your Vercel URL (e.g., `https://kalyanis-kids-square.vercel.app`)

---

## Step 4 — Connect them together

Go back to **Render → Your Backend → Environment**:
- Add `FRONTEND_URL` = `https://kalyanis-kids-square.vercel.app` *(Replace with your actual Vercel URL)*
- Click **Save changes** → Render will auto-redeploy

---

## ✅ You're Live!

Your site is now live at your Vercel URL. Share it with the world!

> **Note**: Free Render services "sleep" after 15 min of inactivity and take ~30 sec to wake up on first visit. To avoid this, you can upgrade to Render's paid plan later.
