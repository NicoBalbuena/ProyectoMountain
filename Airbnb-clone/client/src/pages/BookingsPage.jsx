import { useEffect, useState } from "react"
import AccountNav from "../components/AccountNav"
import axios from "axios"
import PlaceImg from "../components/PlaceImg"

const BookingsPage = () => {

    const [bookings, setBookings] = useState([])

    useEffect(() => {
        axios.get("http://localhost:4000/bookings", { withCredentials: true })
            .then(res => {
                setBookings(res.data)
            })
    }, [])

    return (
        <div>
            <AccountNav />
            <div className="">
                {bookings?.length > 0 && bookings.map((booking, index) => (
                    <div key={booking._id} className="flex gap-4 bg-gray-200 rounded-2xl overflow-hidden">
                        <div className="w-48">
                            <PlaceImg place={booking.place} />
                        </div>
                        <div className="py-3">
                            <h2 className="text-xl">{booking.place.title}</h2>
                            {booking.checkIn} - {booking.checkOut}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default BookingsPage