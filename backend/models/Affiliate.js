const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const affiliateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false // Do not return password by default
    },
    affiliateCode: {
        type: String,
        required: [true, 'Please add an affiliate code'],
        unique: true,
        trim: true
    },
    commissionRate: {
        type: Number,
        default: 10,
        min: 0,
        max: 100
    },
    approved: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        enum: ['affiliate', 'admin'],
        default: 'affiliate'
    },
    paymentMethod: {
        type: String,
        enum: ['paypal', 'stripe'],
        default: null
    },
    paymentEmail: {
        type: String,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid payment email'
        ],
        default: null
    }
}, {
    timestamps: true
});

// Encrypt password using bcrypt
affiliateSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
affiliateSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Affiliate', affiliateSchema);
