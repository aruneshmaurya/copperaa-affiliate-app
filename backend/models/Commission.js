const mongoose = require('mongoose');

const commissionSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true
    },
    affiliate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Affiliate',
        required: true,
        index: true
    },
    orderSubtotal: {
        type: Number,
        required: true
    },
    commissionAmount: {
        type: Number,
        required: true
    },
    commissionRate: {
        type: Number,
        default: 10
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'reversed', 'paid'],
        default: 'pending',
        index: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Commission', commissionSchema);
