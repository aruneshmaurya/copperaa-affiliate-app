const rateLimit = require('express-rate-limit');

// General Limiter (Fallback)
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per IP
    message: 'Too many requests, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
});

// Auth Limiter (Strict: 5 req/min)
const authLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 50, // Relaxed for testing (was 5)
    message: 'Too many login attempts, please try again in a minute',
    standardHeaders: true,
    legacyHeaders: false,
});

// Admin Limiter (Moderate: 30 req/min)
const adminLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 30,
    message: 'Too many admin requests',
    standardHeaders: true,
    legacyHeaders: false,
});

// Tracking Limiter (High: 60 req/min - 1 req per sec approx)
const trackingLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 60,
    message: 'Too many tracking requests',
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = {
    generalLimiter,
    authLimiter,
    adminLimiter,
    trackingLimiter
};
