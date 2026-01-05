const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Trust Proxy (Required for Render/Heroku with rate limiters)
app.set('trust proxy', 1);

// Middleware Imports
const {
    authLimiter,
    adminLimiter,
    trackingLimiter,
    generalLimiter
} = require('./middleware/rateLimiter');

// CORS Configuration (Permissive for Testing)
app.use(cors({
    origin: '*', // Allow all origins temporarily for testing
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    credentials: true,
    optionsSuccessStatus: 200
}));

// app.use(helmet()); // Temporarily disable helmet if it causes issues, but usually fine. Keeping helmet.
app.use(helmet());

// Body parser (Modified to save rawBody for HMAC verification)
app.use(express.json({
    verify: (req, res, buf) => {
        req.rawBody = buf.toString();
    }
}));

// Health Check Route (No Limit)
// Health Check Route (No Limit)
app.get('/', (req, res) => {
    res.status(200).send('Copperaa Affiliate App Running');
});

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Copperaa Affiliate Backend is running' });
});

// Routes with Rate Limiters
app.use('/api/auth', authLimiter, require('./routes/auth.routes'));
app.use('/api/admin', adminLimiter, require('./routes/admin.routes'));
app.use('/api/referrals', trackingLimiter, require('./routes/referral.routes'));
app.use('/api/affiliate', authLimiter, require('./routes/affiliate.dashboard.routes')); // Reuse auth limiter or general? Using auth limiter for safety
app.use('/api/webhooks', require('./routes/webhook.routes'));
app.use('/api/track', require('./routes/tracking.routes'));

// Error Handler (Last middleware)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Only listen if the file is run directly (not imported as a module)
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
}

module.exports = app;
