(function () {
    'use strict';

    // CONFIGURATION
    const COOKIE_NAME = 'affiliate_ref';
    const COOKIE_DURATION_DAYS = 30;
    const API_ENDPOINT = 'https://YOUR_BACKEND_URL.com/api/referrals/track'; // Replace with actual backend URL in prod

    // HELPER: Get URL Parameter
    function getQueryParam(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    // HELPER: Set Cookie
    function setCookie(name, value, days) {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Lax; Secure";
    }

    // HELPER: Get Cookie
    function getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    // MAIN LOGIC
    function initAffiliateTracking() {
        const refCode = getQueryParam('ref');

        // 1. Check if 'ref' param exists
        if (refCode) {

            // 2. Check if cookie already exists
            const existingCookie = getCookie(COOKIE_NAME);

            if (!existingCookie) {
                console.log('Copperaa Affiliate: New referral detected:', refCode);

                // 3. Set Cookie (First click wins model)
                setCookie(COOKIE_NAME, refCode, COOKIE_DURATION_DAYS);

                // 4. Send Tracking Event to Backend (Async)
                fetch(API_ENDPOINT, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        affiliateCode: refCode
                    })
                }).catch(err => console.error('Copperaa Affiliate: Tracking error', err));

            } else {
                console.log('Copperaa Affiliate: Existing cookie found. Ignoring new ref.');
            }
        }

        // 5. Sync with Shopify Cart (Always check if cookie is present)
        const activeRef = getCookie(COOKIE_NAME);
        if (activeRef) {
            syncCartAttribute(activeRef);
        }
    }

    // HELPER: Sync to Shopify Cart
    function syncCartAttribute(refCode) {
        // Fetch current cart to check if attribute is already set (optional optimization)
        // For now, we just blindly update to ensure it's there.
        // Using Shopify AJAX API
        fetch('/cart/update.js', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                attributes: {
                    'affiliate_ref': refCode
                }
            })
        })
            .then(response => response.json())
            .then(data => console.log('Copperaa Affiliate: Cart synced', data))
            .catch(err => console.error('Copperaa Affiliate: Cart sync failed', err));
    }

    // Run on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAffiliateTracking);
    } else {
        initAffiliateTracking();
    }

})();
