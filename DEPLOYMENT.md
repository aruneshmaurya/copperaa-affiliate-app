# Deployment Guide: Affiliate Platform

Since you want to host this on a subdomain (like `partners.copperaa.com`) while keeping your main site on Shopify, the best approach is to host the **Frontend** and **Backend** separately. This is a standard, robust, and often free/cheap architecture.

## Strategy
1.  **Backend (API)**: Hosted on **Render** (Node.js).
2.  **Frontend (UI)**: Hosted on **Vercel** (React).
3.  **Domain**: `partners.copperaa.com` points to Vercel.

---

## Step 1: Deploy Backend to Render

1.  Push your latest code to GitHub.
2.  Go to [dashboard.render.com](https://dashboard.render.com/).
3.  Click **New +** -> **Web Service**.
4.  Connect your GitHub repository.
5.  **Settings**:
    *   **Root Directory**: `backend`
    *   **Build Command**: `npm install`
    *   **Start Command**: `node server.js`
    *   **Environment Variables**:
        *   `MONGODB_URI`: (Your MongoDB Connection String)
        *   `JWT_SECRET`: (Your Secret Key)
        *   `NODE_ENV`: `production`
6.  Click **Deploy**.
7.  **Copy the URL** Render gives you (e.g., `https://copperaa-affiliate-backend.onrender.com`). You will need this for the frontend.

---

## Step 2: Deploy Frontend to Vercel

1.  Go to [vercel.com](https://vercel.com/) and Sign Up/Login.
2.  Click **Add New...** -> **Project**.
3.  Import your GitHub repository.
4.  **Configure Project**:
    *   **Framework Preset**: Create React App (should auto-detect).
    *   **Root Directory**: Click "Edit" and select `frontend`.
    *   **Environment Variables**:
        *   Name: `REACT_APP_API_URL`
        *   Value: `https://YOUR-RENDER-BACKEND-URL.onrender.com/api` (Paste the URL from Step 1, append `/api`).
5.  Click **Deploy**.

---

## Step 3: Connect Subdomain (partners.copperaa.com)

1.  In your **Vercel Dashboard**, go to your new project -> **Settings** -> **Domains**.
2.  Enter your desired subdomain, e.g., `partners.copperaa.com`.
3.  Vercel will give you DNS records to add.
    *   Type: `CNAME`
    *   Name: `partners`
    *   Value: `cname.vercel-dns.com`
4.  **Go to your Domain Provider** (GoDaddy, Namecheap, or Shopify if managing DNS there).
5.  Add the `CNAME` record provided by Vercel.
6.  Wait for propagation (usually minutes).

**Success!** Your affiliate platform will now be live at `partners.copperaa.com`.
