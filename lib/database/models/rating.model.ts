import { Schema, model, models } from "mongoose";

const RatingSchema = new Schema({
    userId: { type: String, required: true },
    eventId: { type: String, required: true },
    rating: { type: Number, required: true, min: 0, max: 5 },
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
});

RatingSchema.index({ userId: 1, eventId: 1 }, { unique: true }); // Unique index to prevent duplicate ratings

const Rating = models.Rating || model('Rating', RatingSchema);

export default Rating;
