import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    uid: { type: String, unique: true }, // Keeping uid for backward compat or just as a unique ID
    email: { type: String, required: true, unique: true },
    password: { type: String, select: false }, // Password is optional for now to allow existing users (if any) to be handled gracefully, or forced reset
    displayName: { type: String },
    role: {
        type: String,
        enum: ['admin', 'client'],
        default: 'client',
    },
    createdAt: { type: Date, default: Date.now },
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

export default mongoose.models.User || mongoose.model('User', UserSchema);
