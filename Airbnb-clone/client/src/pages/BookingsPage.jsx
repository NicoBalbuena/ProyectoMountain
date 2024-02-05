import { useEffect, useState } from "react";
import AccountNav from "../components/AccountNav";
import axios from "axios";
import PlaceImg from "../components/PlaceImg";
import { differenceInCalendarDays, format } from "date-fns";
// eslint-disable-next-line no-unused-vars
import { Link } from "react-router-dom";
import Swal from "sweetalert2"

const BookingsPage = () => {
    const [bookings, setBookings] = useState([]);
    const [reviews, setReviews] = useState({}); // Objeto para almacenar las revisiones asociadas a las reservas
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    // Recuperar el placeId de localStorage
    const placeId = localStorage.getItem('placeId');

    useEffect(() => {
        axios.get("http://localhost:4000/bookings", { withCredentials: true })
            .then(res => {
                setBookings(res.data);
            })
    }, []);

    const handleSubmit = async (event, review, rating) => {
        event.preventDefault();
        setIsSubmitting(true);
        setSubmitError(null);
    
        try {
            const response = await axios.post(`http://localhost:4000/places/${placeId}/reviews`, {
                data: {
                    review,
                    rating,
                }
            }, { withCredentials: true });
    
            // Check if the request was successful
            if (response.status === 200) {
                // Show SweetAlert2 success message
                Swal.fire({
                    title: "Review submitted successfully!",
                    icon: "success",
                });
                setSubmitSuccess(true);
            } else {
                setSubmitError("Error submitting the review. Please try again later.");
            }
        } catch (error) {
            // Handle request errors
            console.error("Error submitting the review:", error);
            setSubmitError("Error submitting the review. Please try again later.");
        } finally {
            setIsSubmitting(false);
        }
    };


    const handleReviewChange = (event, bookingId) => {
        const { value } = event.target;
        setReviews(prevReviews => ({
            ...prevReviews,
            [bookingId]: {
                ...prevReviews[bookingId],
                review: value
            }
        }));
    };

    const handleRatingChange = (event, bookingId) => {
        const { value } = event.target;
        setReviews(prevReviews => ({
            ...prevReviews,
            [bookingId]: {
                ...prevReviews[bookingId],
                rating: parseInt(value)
            }
        }));
    };

    const handleCancelReservation = async (bookingId) => {
        try {
            // Lógica para cancelar la reserva utilizando axios.delete u otro método
            await axios.delete(`http://localhost:4000/bookings/${bookingId}`, { withCredentials: true });
            // Actualizar la lista de reservas después de la cancelación
            setBookings((prevBookings) => prevBookings.filter((booking) => booking._id !== bookingId));
            
            // Mostrar el mensaje de éxito con SweetAlert2
            Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, I want to cancel my reservation."
              }).then((result) => {
                if (result.isConfirmed) {
                  Swal.fire({
                    title: "Ready!",
                    text: "Your reservation has been successfully canceled!",
                    icon: "success"
                  });
                }
              });
        } catch (error) {
            console.error("Error canceling reservation", error);
            // Manejo de errores
            Swal.fire({
                title: "Error",
                text: "There was an error canceling the reservation. Please try again later.",
                icon: "error"
            });
        }
    };
    

    return (
        <div className="mb-[15px]">
            <AccountNav />
            <div className="mx-5">
                {bookings?.length > 0 && bookings.map((booking, index) => (
                    <div key={booking._id} className="flex gap-4 shadow shadow-black rounded-2xl overflow-hidden mt-3">
                        <Link  to={`/account/bookings/${booking._id}`} className="w-48">
                            <PlaceImg place={booking.place} />
                        </Link>
                        <div className="py-3 pr-3 grow ">
                            <h2 className="text-xl">{booking.place.title}</h2>
                            <div className="flex gap-2 items-center border-t border-gray-300 mt-2 py-2">
                                <div className="flex gap-1 items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
                                    </svg>
                                    {format(new Date(booking.checkIn), 'yyyy-MM-dd')}
                                </div>
                                &rarr;
                                <div className="flex gap-1 items-center ">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
                                    </svg>
                                    {format(new Date(booking.checkOut), 'yyyy-MM-dd')}
                                </div>
                            </div>
                            <div className="text-xl">
                                <div className="flex gap-1 ">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
                                    </svg>
                                    Nights: {differenceInCalendarDays(new Date(booking.checkOut), new Date(booking.checkIn))}
                                </div>
                                <div className="flex gap-1 mt-2 items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
                                    </svg>
                                    Total price: ${booking.price}
                                </div>
                            </div>
                            <form onSubmit={(event) => handleSubmit(event, reviews[booking._id]?.review, reviews[booking._id]?.rating)} className="mt-4">

                                <label htmlFor={`review-${booking._id}`} className="block text-lg font-medium text-gray-700">
                                Have you already visited this site? Rate it!
                                </label>
                                <textarea
                                    id={`review-${booking._id}`}
                                    value={reviews[booking._id]?.review || ""}
                                    onChange={(event) => handleReviewChange(event, booking._id)}
                                    rows={4}
                                    maxLength={300}
                                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                    placeholder="Write your review here (maximum 300 characters)"
                                    required
                                />
                                <div className="mt-3">
                                    <label htmlFor={`rating-${booking._id}`} className="block text-lg font-medium text-gray-700">Rating:</label>
                                    <select
                                        id={`rating-${booking._id}`}
                                        value={reviews[booking._id]?.rating || ""}
                                        onChange={(event) => handleRatingChange(event, booking._id)}
                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                        required
                                    >
                                        <option value="">Select an option</option>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                    </select>
                                </div>
                                <div className="mt-3">
                                    <button
                                        type="submit"
                                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        disabled={isSubmitting || submitSuccess}
                                    >
                                        Submit review!
                                    </button>
                                </div>
                            </form>
                            <button
                                onClick={() => handleCancelReservation(booking._id)}
                                className="w-full flex justify-center py-2 px-4 border border-red-500 rounded-md shadow-sm text-sm font-medium text-red-500 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                                Cancel booking
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BookingsPage;
