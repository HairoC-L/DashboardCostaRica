import mongoose from 'mongoose';

const MapPinSchema = new mongoose.Schema({
    label: { type: String, required: true },
    position: {
        type: [Number], // [x, y, z]
        required: true,
    },
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

export default mongoose.models.MapPin || mongoose.model('MapPin', MapPinSchema);
