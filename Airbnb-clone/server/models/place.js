const mongoose = require("mongoose");

const placeSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    title: String,
    address: String,
    photos: [String],
    description: String,
    perks: [String],
    extraInfo: String,
    checkIn: Number,
    checkOut: Number,
    guests: Number,
    price: Number,
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
})

const PlaceModel = mongoose.model("Place", placeSchema);

module.exports = PlaceModel;