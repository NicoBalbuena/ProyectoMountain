const Review = require("./models/reviews");
const Place = require("./models/place");
const jwt = require("jsonwebtoken");

const jwtSecret = "ksdojodksokdmc3";

const createReview = async (req, res) => {
    const { token } = req.cookies;
    const { data } = req.body;
    const { placeId } = req.params;
    const { rating, reviewText } = data;
    console.log("rating: ", rating);
    console.log("reviewText: ", reviewText);
    try {

        // Verificar el token y obtener el ID del usuario
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            if (err) {
                console.error("Error al verificar el token:", err);
                throw err;
            }
            console.log("userData: ", userData);

            // Crear la revisión
            const reviewDoc = await Review.create({
                user: userData._id,
                place: placeId,
                rating,
                reviewText,
            });

            console.log("reviewDoc: ", reviewDoc);

            // Asociar la revisión al lugar
            const place = await Place.findById(placeId);
            place.reviews.push(reviewDoc._id);
            // Guardar el lugar con la nueva revisión
            await place.save();

            res.json(reviewDoc);
        });
    } catch (error) {
        console.error("Error al crear la revisión:", error);
        res.status(422).json({ error: "No se pudo crear la revisión" });
    }
};

const getReviewsByPlace = async (req, res) => {
    const { placeId } = req.params;

    try {
        // Obtener todas las revisiones para una cabaña específica, incluyendo la información del usuario
        const reviews = await Review.find({ place: placeId, deleted: false }).populate("user");

        // Calcular el avgRating para todas las revisiones de esta cabaña
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const avgRating = reviews.length > 0 ? totalRating / reviews.length : 0;

        res.json({ reviews, avgRating });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const getReviewsAll = async (req, res) => {

    try {
        // Obtener todas las revisiones para una cabaña específica, incluyendo la información del usuario
        const reviews = await Review.find().populate("user");

        // Calcular el avgRating para todas las revisiones de esta cabaña

        res.json({ reviews });
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



module.exports = { createReview, getReviewsByPlace, getPlacesSortedByReviewAsc, getPlacesSortedByReviewDesc, getReviewsAll };
