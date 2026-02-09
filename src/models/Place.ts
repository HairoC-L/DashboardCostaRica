import mongoose from 'mongoose';

const PlaceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    images: [{ type: String }],
    slug: { type: String },
    officialName: { type: String },
    shortDescription: { type: String },
    region: { type: String },
    heroImage: { type: String },
    galleryImages: [{ type: String }],
    coordinates: {
        lat: { type: Number },
        lng: { type: Number },
    },
    ecosystem: { type: String },
    category: {
        type: String,
        enum: ['playas', 'volcanes', 'parques', 'rutas', 'otro'],
        required: true,
    },
    googleMapsLink: { type: String },
    howToGetThere: { type: String },
    view360Main: { type: String },
    view360Extras: [{ type: String }],
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

export default mongoose.models.Place || mongoose.model('Place', PlaceSchema);
