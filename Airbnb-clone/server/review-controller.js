const Review = require("./models/reviews");
const Place = require("./models/place");
const jwt = require("jsonwebtoken");

const jwtSecret = "ksdojodksokdmc3";

const createReview = async (req, res) => {
    const { token } = req.cookies;
    const { data } = req.body;
    const { placeId } = req.params;
    const { rating, reviewText } = data;

    try {
        // Verificar el token y obtener el ID del usuario
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            if (err) throw err;

            // Crear la revisión
            const reviewDoc = await Review.create({
                user: userData.id,
                place: placeId,
                rating,
                reviewText,
            });

            // Asociar la revisión al lugar
            const place = await Place.findById(placeId);
            place.reviews.push(reviewDoc._id);
            await place.save();

            // Calcular el nuevo promedio de puntuaciones para el alojamiento
            const reviews = await Review.find({ place: placeId });
            const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
            const averageRating = totalRating / reviews.length;

            // Redondear el promedio a un número entero
            const roundedAverageRating = Math.round(averageRating);

            // Actualizar el promedio de puntuaciones redondeado en el documento del alojamiento
            await Place.findByIdAndUpdate(placeId, { $set: { rating: roundedAverageRating } });

            res.json(reviewDoc);
        });
    } catch (error) {
        res.status(422).json({ error: error.message });
    }
};


const getReviewsByPlace = async (req, res) => {
    const { placeId } = req.params;

    try {
        // Obtener las revisiones para un lugar específico, incluyendo la información del usuario
        const reviews = await Review.find({ place: placeId }).populate("user");

        res.json(reviews);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = { createReview, getReviewsByPlace };
