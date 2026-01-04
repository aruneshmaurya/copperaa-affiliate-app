# Shopify Custom App Setup Guide

This guide details how to configure the **Copperaa Affiliate App** in the Shopify Admin.

## Part A: Create Custom App

1.  **Log in** to your Shopify Admin: [https://admin.shopify.com/store/copperaa](https://admin.shopify.com/store/copperaa)
2.  Navigate to **Settings** > **Apps and sales channels**.
3.  Click **Develop apps**.
4.  If this is your first time, click **Allow custom app development**.
5.  Click **Create an app**.
6.  **App Name**: `Copperaa Affiliate`.
7.  **App Developer**: Select your account.
8.  Click **Create app**.

## Part B: Configure API Scopes

1.  Click **Configure Admin API scopes**.
2.  Search for and verify the following scopes are checked:
    *   `read_customers`
    *   `read_orders`
    *   `write_orders` (Required for tagging orders)
3.  Click **Save**.

## Part C: Install & Get Credentials

1.  Click **Install app** in the top right.
2.  Confirm installation.
3.  **IMPORTANT**: Under "Admin API access token", click **Reveal token once**.
    *   **Copy this token immediately**. You cannot see it again.
    *   This is your `SHOPIFY_ADMIN_API_TOKEN`.
4.  (Optional) Note the API Key and Secret Key, though mostly the Token is used for backend calls.

## Part D: Update Backend Configuration

1.  Open your backend `.env` file (`backend/.env`).
2.  Update the values:

```env
SHOPIFY_STORE_URL=https://copperaa.com
SHOPIFY_ADMIN_API_TOKEN=shpat_xxxxxxxxxxxxxxxxxxxxxxxx  <-- Paste token here
WEBHOOK_SECRET=your_generated_secret_here             <-- You'll get this in Part E
```

## Part E: Register Webhooks

You need to manually register webhooks to notify your backend of events.

**Note**: You need your backend running and accessible publicly (e.g., via Render, Railway, or ngrok for local testing).
*Example URL*: `https://your-app.onrender.com/api/webhooks/...`

Go to **Settings** > **Notifications** > **Webhooks** (at the bottom) > **Create webhook**.

### 1. Order Creation
*   **Event**: `Order creation`
*   **Format**: `JSON`
*   **URL**: `https://YOUR_BACKEND_DOMAIN/api/webhooks/orders/create`
*   **Webhook API version**: (Latest)

### 2. Refund Creation
*   **Event**: `Refund create`
*   **Format**: `JSON`
*   **URL**: `https://YOUR_BACKEND_DOMAIN/api/webhooks/refunds/create`

### 3. Order Cancellation
*   **Event**: `Order cancellation`
*   **Format**: `JSON`
*   **URL**: `https://YOUR_BACKEND_DOMAIN/api/webhooks/orders/cancelled`

### Get Webhook Secret
After creating the first webhook, you will see a **Webhook signing secret** at the bottom of the Webhooks section. 
1.  **Copy this secret**.
2.  Paste it into your `.env` as `WEBHOOK_SECRET`.
3.  **Restart your backend server**.

## Part F: Testing

1.  **Frontend Script**: Ensure `affiliate-tracking.js` is added to your active Shopify theme (`theme.liquid`).
2.  **Test Order**:
    *   Visit store with `?ref=TEST` (Create a test affiliate code first).
    *   Check Browser Console: "Copperaa Affiliate: Cart synced".
    *   Place a test order (Bogus Gateway).
3.  **Verify Backend**:
    *   Check backend logs for "Received Webhook: Order ...".
    *   Check MongoDB `commissions` collection.
    *   Check Shopify Admin: Order should have tag `Affiliate: TEST | 10%`.

## Part G: Common Errors

*   **HMAC Verification Failed**: Ensure `WEBHOOK_SECRET` in `.env` matches the Signing Secret in Shopify Admin exactly. Ensure `server.js` is correctly preserving `req.rawBody` (we configured this in Step 10).
*   **No Commission Created**: Ensure order is `paid`. Ensure `affiliate-tracking.js` successfully synced the `affiliate_ref` to the cart (Check browser network tab for `cart/update.js` call).
