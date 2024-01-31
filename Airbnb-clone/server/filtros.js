const Place = require("./models/place");


const getPlacesByGuests = async (req, res) => {
    const { guests } = req.params;

    try {
        const places = await Place.find({ guests: { $gte: parseInt(guests) } });

        res.json(places);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};


const getPlacesByAvgRating = async (req, res) => {
    const { avgRating } = req.params;

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
            { $match: { avgRating: parseInt(avgRating) } },
        ]);

        res.json(places);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};


const getFilteredPlaces = async (req, res) => {
    try {
        let query = {}; // Inicializa un objeto de consulta vacío

        // Verifica si hay un parámetro avgRating en la consulta
        if (req.query.avgRating) {
            query.avgRating = parseInt(req.query.avgRating); // Filtra por valor de avgRating
        }

        // Verifica si hay un parámetro minGuests en la consulta
        if (req.query.guests) {
            query.guests = { $gte: parseInt(req.query.guests) }; // Filtra por número mínimo de huéspedes
        }

        // Verifica si hay un parámetro de precio en la consulta
        if (req.query.price) {
            switch (req.query.price) {
                case '0-100':
                    query.price = { $gte: 0, $lte: 100 };
                    break;
                case '101-500':
                    query.price = { $gte: 101, $lte: 500 };
                    break;
                case '501-1000':
                    query.price = { $gte: 501, $lte: 1000 };
                    break;
                case '1001-2000':
                    query.price = { $gte: 1001, $lte: 2000 };
                    break;
                case '2001-max':
                    query.price = { $gte: 2001 };
                    break;
                default:
                    break;
            }
        }

        // Realiza la consulta a la base de datos con los filtros aplicados
        const places = await Place.find(query);

        res.json(places);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};



module.exports = {getPlacesByGuests, getPlacesByAvgRating, getFilteredPlaces}