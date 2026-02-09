import mongoose from 'mongoose';

const TourSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    priceChild: { type: Number },
    placeIds: [{ type: String }],
    gallery: [{ type: String }],
    duration: { type: String },
    difficulty: {
        type: String,
        enum: ['Fácil', 'Moderado', 'Difícil', 'Extremo'],
    },
    maxQuota: { type: Number },
    whatItOffers: [{ type: String }],
    features: {
        accommodation: { type: Boolean },
        transport: { type: Boolean },
        entranceFee: { type: Boolean },
        nextTour: { type: Boolean },
        guide: { type: Boolean },
        translator: { type: Boolean },
    },
    meetingPoint: { type: String },
    meetingPointCoordinates: {
        lat: { type: Number },
        lng: { type: Number },
    },
    meetingPointLink: { type: String },
    schedules: [{ type: String }],
    availableDates: [{
        date: { type: String },
        schedules: [{ type: String }],
    }],
    cancellationPolicy: { type: String },
    pricingTiers: [{
        label: { type: String },
        price: { type: Number },
    }],
    schedule: { type: String },
    guideName: { type: String },
    includes: [{ type: String }],
    excludes: [{ type: String }],
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        versionKey: false,
        transform: function (doc, ret: any) {
            ret.id = ret._id;
            delete ret._id;
        }
    },
    toObject: { virtuals: true }
});

export default mongoose.models.Tour || mongoose.model('Tour', TourSchema);
