import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Subscription name is required'],
        trim: true,
        minLength: 2,
        maxLength: 100,
    },
    price: {
        type: Number,
        required: [true, 'Subscription price is required'],
        min: [1, 'Price must be greater than 0'],
        max: [1000, 'Price must be less than 1000']
    },
    currency: {
        type: String,
        enum: ['USD', 'EUR', 'GBP'],
        default: 'USD'
    },
    frequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'yearly'],
        required: [true, 'Subscription frequency is required']
    },
    category: {
        type: String,
        enum: ['sports', 'entertainment', 'lifestyle', 'technology', 'finance', 'politics', 'other'],
        required: true
    },
    paymentMethod: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['active', 'canceled', 'expired'],
        default: 'active',
    },
    startDate: {
        type: Date,
        required: true,
        validate: {
            validator: (value) => value <= new Date(),
            message: 'Start date must be in the past',
        }
    },
    renewalDate: {
        type: Date,
        validate: {
            validator: function(value) {
                if (!this.startDate || !value) return true;
                return value >= this.startDate;
            },
            message: 'Renewal date must be after the start date',
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    }
}, { timestamps: true });


// ✅ Async middleware (NO next)
subscriptionSchema.pre('save', async function () {

    if (!this.frequency) {
        throw new Error('Frequency is required to calculate renewal date');
    }

    // Auto-calculate renewal date if missing
    if (!this.renewalDate) {
        this.renewalDate = new Date(this.startDate);

        switch (this.frequency) {
            case 'daily':
                this.renewalDate.setDate(this.renewalDate.getDate() + 1);
                break;
            case 'weekly':
                this.renewalDate.setDate(this.renewalDate.getDate() + 7);
                break;
            case 'monthly':
                this.renewalDate.setMonth(this.renewalDate.getMonth() + 1);
                break;
            case 'yearly':
                this.renewalDate.setFullYear(this.renewalDate.getFullYear() + 1);
                break;
            default:
                throw new Error(`Invalid frequency: ${this.frequency}`);
        }
    }

    // Auto-update status
    if (this.renewalDate && this.renewalDate < new Date()) {
        this.status = 'expired';
    }
});


const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;