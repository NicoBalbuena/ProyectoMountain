const Place = require("./models/place");


const getPlacesByGuests = async (req, res) => {
    const { minGuests } = req.params;

    try {
        const places = await Place.find({ guests: { $gte: parseInt(minGuests) } });

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

const getAvailablePlaces = async (req, res) => {
    const { checkIn, checkOut } = req.params;

    try {
        const places = await Place.find({
            $or: [
                {
                    $and: [
                        { checkIn: { $lte: new Date(checkIn) } },
                        { checkOut: { $gte: new Date(checkIn) } }
                    ]
                },
                {
                    $and: [
                        { checkIn: { $lte: new Date(checkOut) } },
                        { checkOut: { $gte: new Date(checkOut) } }
                    ]
                },
                {
                    $and: [
                        { checkIn: { $gte: new Date(checkIn) } },
                        { checkOut: { $lte: new Date(checkOut) } }
                    ]
                }
            ]
        });

        res.json(places);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};



module.exports = {getPlacesByGuests, getPlacesByAvgRating, getAvailablePlaces}