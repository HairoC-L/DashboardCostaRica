import mongoose from 'mongoose';

const PackageSchema = new mongoose.Schema({
    title: { type: String, required: true },
    price: { type: Number, required: true },
    images: [{ type: String }],
    tags: [{ type: String }],
    duration_days: { type: Number, required: true },
    duration_nights: { type: Number, required: true },
    included: [{ type: String }],
    description: { type: String },
    tourIds: [{ type: String }],
    itinerary: [{
        day: { type: Number },
        title: { type: String },
        description: { type: String },
    }],
    priceType: {
        type: String,
        enum: ['per_person', 'per_group'],
    },
    includesTransport: { type: Boolean },
    name: { type: String },
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

export default mongoose.models.Package || mongoose.model('Package', PackageSchema);
