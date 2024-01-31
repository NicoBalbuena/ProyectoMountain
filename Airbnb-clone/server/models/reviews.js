const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    place: { type: mongoose.Schema.Types.ObjectId, ref: "Place" },
    rating: { type: Number, min: 1, max: 5 },
    reviewText: String,
    deleted: { type: Boolean, default: false }
});

const ReviewModel = mongoose.model("Review", reviewSchema);

module.exports = ReviewModel;
