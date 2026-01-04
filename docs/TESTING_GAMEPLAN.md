# Final Testing & Go-Live Gameplan

This document outlines the exact steps to verify your **Copperaa Affiliate App** is working correctly in the live environment.

## Part A: Install Referral Script

You need to add the tracking logic to your Shopify store. Since we are avoiding paid apps, we will manually inject the script.

### 1. Prepare the Script
Open `frontend/public/affiliate-tracking.js`.
**CRITICAL**: Replace the `API_ENDPOINT` with your actual deployed backend URL.
*   Example: `const API_ENDPOINT = 'https://copperaa-affiliate.onrender.com/api/referrals/track';`

### 2. Add to Shopify Theme
1.  Go to **Shopify Admin > Online Store > Themes**.
2.  Click **... (Actions)** > **Edit code**.
3.  Open `layout/theme.liquid`.
4.  Scroll down to the closing `</body>` tag.
5.  Paste the following code just **before** `</body>`:

```html
<!-- Copperaa Affiliate Tracking -->
<script>
(function() {
    'use strict';
    const COOKIE_NAME = 'affiliate_ref';
    const COOKIE_DURATION_DAYS = 30;
    const API_ENDPOINT = 'YOUR_BACKEND_URL_HERE/api/referrals/track'; // REPLACE THIS URL

    function getQueryParam(n){const p=new URLSearchParams(window.location.search);return p.get(n);}
    function setCookie(n,v,d){let e="";if(d){const t=new Date();t.setTime(t.getTime()+(d*86400000));e="; expires="+t.toUTCString();}document.cookie=n+"="+(v||"")+e+"; path=/; SameSite=Lax; Secure";}
    function getCookie(n){const eq=n+"=";const ca=document.cookie.split(';');for(let i=0;i<ca.length;i++){let c=ca[i];while(c.charAt(0)==' ')c=c.substring(1,c.length);if(c.indexOf(eq)==0)return c.substring(eq.length,c.length);}return null;}
    function syncCart(ref){fetch('/cart/update.js',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({attributes:{'affiliate_ref':ref}})}).catch(e=>console.error('Affiliate sync err',e));}

    function init(){
        const ref = getQueryParam('ref');
        if(ref){
            const exist = getCookie(COOKIE_NAME);
            if(!exist){
                setCookie(COOKIE_NAME, ref, COOKIE_DURATION_DAYS);
                fetch(API_ENDPOINT, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ affiliateCode: ref })
                }).catch(e=>{});
            }
        }
        const activeVar = getCookie(COOKIE_NAME);
        if(activeVar) syncCart(activeVar);
    }

    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
</script>
```

*(Note: The inline script above is a minified version of your file for better performance. Ensure you replace `YOUR_BACKEND_URL_HERE`)*.

---

## Part B: Verify Tracking (Cookie & Backend)

1.  **Open Incognito Window**.
2.  Go to `https://copperaa.com/?ref=TEST001` (Use a code you haven't registered if you just want to test cookie, or register `TEST001` in your admin first).
3.  **Check Cookie**:
    *   Right-click > Inspect > Application > Cookies.
    *   Look for `affiliate_ref`. Value should be `TEST001`.
4.  **Check Backend**:
    *   If `TEST001` is a valid approved affiliate in your DB, you should see a new entry in the `Referrals` collection.
    *   If it's not valid, the backend logs might show 404 (which is correct behavior).

---

## Part C: Full Order Test

1.  **Register a Test Affiliate**:
    *   Go to your App Frontend: `/register`.
    *   Name: `Tester`, Email: `tester@test.com`.
    *   Login as Admin and **Approve** this user.
    *   Get their code (e.g., `TESTER123`).

2.  **Shop as Customer**:
    *   Open Incognito.
    *   Visit `https://copperaa.com/?ref=TESTER123`.
    *   Add a product to cart.
    *   **Verify Cart Sync**: Open Network Tab, look for `update.js`. It should send `attributes[affiliate_ref]: TESTER123`.

3.  **Checkout**:
    *   Use **Bogus Gateway** (if enabled) or a real card (refund later).
    *   Checkout as Guest or Customer.

4.  **Verify Attribution**:
    *   **Shopify Admin**: Open the order. Check **Tags**. It should say `Affiliate: TESTER123 | 10%`.
    *   **App Admin**: Go to Commissions page. New "Unpaid" commission should appear.

---

## Part D: Refund Test

1.  **Go to Shopify Admin** > Orders.
2.  Select the test order from Part C.
3.  Click **Refund**.
4.  Refund the full amount.
5.  **Verify App Admin**:
    *   Refresh Commissions page.
    *   Status should change to `CANCELLED`.
    *   Commission amount should be `0`.

---

## Part E: Production Checklist

*   [ ] Backend deployed (HTTPS).
*   [ ] `SHOPIFY_ADMIN_API_TOKEN` set in env.
*   [ ] `WEBHOOK_SECRET` set in env.
*   [ ] Webhooks registered in Shopify Admin (Orders Create, Refund Create, Order Cancel).
*   [ ] Tracking script added to `theme.liquid`.
*   [ ] Admin user account secured.
*   [ ] Database backups enabled (if using Atlas).
