const BookingModel = require("./models/booking.js");
const PlaceModel = require("./models/place.js");
const ReviewModel = require("./models/reviews.js");
const UserModel = require("./models/user.js");

const deletePlace = async (req, res) => {
    
    try {
        const { value }=req.body
        const { id } = req.params;
        const place = await PlaceModel.findOneAndUpdate(
            { _id: id },
            { $set: { deleted: value } },
            { new: true }
        );

        if (!place) {
            return res.status(404).json({ message: "Place not found" });
        }

        return res.status(200).json({ message: "Place deleted successfully" });
    } catch (error) {
        console.error("Error deleting place:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { value }=req.body
        const { id } = req.params;
        console.log(id)
        const user = await UserModel.findOneAndUpdate(
            {_id: id},
            { $set: { deleted: value }},
            {new : true }
        );

        if(!user) {
            return res.status(404).json({ message: "User not found"});
        }

        return res.status(200).json({ message: "User deleted succesfully"});
    } catch (error) {
        console.error("Error deleting user:", error);
        return res.status(500).json({ message: "Interal Server Error"});
    }
}

const deleteReview = async (req, res) => {
    try {
        const { id } = req.params;
        const review = await ReviewModel.findOneAndUpdate(
            { _id: id },
            { $set: { deleted: true }},
            { new: true }
        );

        if(!review) return res.status(404).json({message: "Review not found"});

        return res.status(200).json({message: "Review deleted succesfully"});
    } catch (error) {
        console.error("Error deleting review", error);
        return res.status(500).json({ message: "Internal Server Error"});
    }
}

const deleteBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await BookingModel.findOneAndUpdate(
            { _id: id },
            { $set: { deleted: true }},
            { new: true }
        );
        if(!booking) return res.status(404).json({message: "Booking not found"});

        return res.status(200).json({message: "Booking deleted succesfully"});
    } catch (error) {
        console.error("Error deleting booking", error);
        return res.status(500).json({ message: "Internal Server Error"});
    }
}

module.exports = {
    deletePlace,
    deleteUser,
    deleteReview,
    deleteBooking
};