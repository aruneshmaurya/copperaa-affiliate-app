const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler'); // Recommending async-handler for cleaner controllers but can use try/catch too. I will stick to try/catch for no extra deps or minimal deps pattern requested, but manual async handling is tedious. I will write manual try-catch wrappers to respect "No new dependencies for async handler" unless user allows. Actually, steps didn't forbid express-async-handler but "Use ONLY free, open-source libraries" implies standard ones. I'll stick to try-catch blocks to minimize dependencies as requested in Step 1 for "minimal".

// Wait, standard practice is try/catch in raw controller if no wrapper.

const Affiliate = require('../models/Affiliate');

// Generate JWT
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });
};

// @desc    Register a new affiliate
// @route   POST /api/auth/register
// @access  Public
const registerAffiliate = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            res.status(400);
            throw new Error('Please add all fields');
        }

        // Check availability
        const userExists = await Affiliate.findOne({ email });
        if (userExists) {
            res.status(400);
            throw new Error('User already exists');
        }

        // Generate Affiliate Code (Simple approach: First Name + Random 4 digits)
        const cleanName = name.replace(/[^a-zA-Z]/g, '').slice(0, 5).toUpperCase();
        const uniqueCode = cleanName + Math.floor(1000 + Math.random() * 9000);

        // Sanity check uniqueness of code could be better, but acceptable for MVP
        // In prod, would want a loop or uuid fallback.

        const affiliate = await Affiliate.create({
            name,
            email,
            password,
            affiliateCode: uniqueCode,
            role: 'affiliate',
            approved: false // Default pending
        });

        if (affiliate) {
            res.status(201).json({
                _id: affiliate.id,
                name: affiliate.name,
                email: affiliate.email,
                affiliateCode: affiliate.affiliateCode,
                message: 'Registration successful! Please wait for admin approval.'
            });
        } else {
            res.status(400);
            throw new Error('Invalid user data');
        }
    } catch (error) {
        // Pass to global error handler
        res.status(res.statusCode === 200 ? 500 : res.statusCode);
        res.json({ message: error.message });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for user email
        const user = await Affiliate.findOne({ email }).select('+password');

        if (user && (await user.matchPassword(password))) {

            // Check approval if NOT admin
            if (user.role !== 'admin' && !user.approved) {
                res.status(403);
                throw new Error('Account pending approval. Contact support.');
            }

            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                affiliateCode: user.affiliateCode,
                token: generateToken(user._id, user.role),
            });
        } else {
            res.status(401);
            throw new Error('Invalid credentials');
        }
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode);
        res.json({ message: error.message });
    }
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    registerAffiliate,
    loginUser,
    getMe,
};
