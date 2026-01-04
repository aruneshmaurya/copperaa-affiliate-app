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

// Middleware Imports
const {
    authLimiter,
    adminLimiter,
    trackingLimiter,
    generalLimiter
} = require('./middleware/rateLimiter');

// CORS Configuration (Strict)
const corsOptions = {
    origin: function (origin, callback) {
        // Allow mobile apps, Postman (no origin), and specific domains
        const allowedOrigins = [
            process.env.FRONTEND_URL || 'http://localhost:3000',
            process.env.SHOPIFY_STORE_URL || 'https://copperaa.com'
        ];

        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
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
app.use('/api/webhooks', require('./routes/webhook.routes')); // Webhooks do not use rate limit middleware usually as Shopify sends them, but hmac validation is there

// Error Handler (Last middleware)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
