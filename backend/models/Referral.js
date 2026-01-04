const mongoose = require('mongoose');

const referralSchema = new mongoose.Schema({
    affiliate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Affiliate',
        required: true,
        index: true
    },
    refCode: {
        type: String,
        required: true
    },
    ipAddress: {
        type: String,
        required: false
    },
    userAgent: {
        type: String,
        required: false
    }
}, {
    timestamps: true
});

// Compound index for querying referrals by affiliate within a time range
referralSchema.index({ affiliate: 1, createdAt: -1 });

module.exports = mongoose.model('Referral', referralSchema);
