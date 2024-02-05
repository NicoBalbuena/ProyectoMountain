const mongoose = require("mongoose");

const placeSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    title: String,
    address: String,
    photos: [String],
    description: String,
    perks: [String],
    extraInfo: String,
    type: String,
    guests: Number,
    price: Number,
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
    avgRating: Number,
    deleted: { type: Boolean, default: false }
});

// Middleware init para ejecutar código cada vez que se inicializa un documento Place
placeSchema.post("init", async function(doc) {
    try {
        // Obtener las revisiones asociadas al lugar
        const reviewsData = await mongoose.model("Review").find({ _id: { $in: doc.reviews } });

        // Calcular el avgRating
        doc.avgRating = reviewsData.length > 0 ? reviewsData.reduce((sum, review) => sum + review.rating, 0) / reviewsData.length : 0;
    } catch (error) {
        console.error("Error al calcular avgRating:", error);
    }
});

const PlaceModel = mongoose.model("Place", placeSchema);

module.exports = PlaceModel;
