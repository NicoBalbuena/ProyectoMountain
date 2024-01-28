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
            
            // Guardar el lugar con la nueva revisión
            await place.save();

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

        // Calcular el avgRating
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const avgRating = totalRating / reviews.length;

        res.json({ reviews, avgRating });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const getPlacesSortedByReviewAsc = async (req, res) => {
    try {
        const places = await Place.aggregate([
            {
                $lookup: {
                    from: "reviews",
                    localField: "reviews",
                    foreignField: "_id",
                    as: "reviewsData",
                },
            },
            {
                $addFields: {
                    avgRating: {
                        $cond: {
                            if: { $gt: [{ $size: "$reviewsData" }, 0] },
                            then: {
                                $divide: [
                                    { $sum: "$reviewsData.rating" },
                                    { $size: "$reviewsData" },
                                ],
                            },
                            else: 0,
                        },
                    },
                },
            },
            { $sort: { avgRating: 1 } },
        ]);

        res.json(places);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const getPlacesSortedByReviewDesc = async (req, res) => {
    try {
        const places = await Place.aggregate([
            {
                $lookup: {
                    from: "reviews",
                    localField: "reviews",
                    foreignField: "_id",
                    as: "reviewsData",
                },
            },
            {
                $addFields: {
                    avgRating: {
                        $cond: {
                            if: { $gt: [{ $size: "$reviewsData" }, 0] },
                            then: {
                                $divide: [
                                    { $sum: "$reviewsData.rating" },
                                    { $size: "$reviewsData" },
                                ],
                            },
                            else: 0,
                        },
                    },
                },
            },
            { $sort: { avgRating: -1 } },
        ]);

        res.json(places);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = { createReview, getReviewsByPlace, getPlacesSortedByReviewAsc, getPlacesSortedByReviewDesc };
