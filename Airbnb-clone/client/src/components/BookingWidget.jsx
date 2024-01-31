import { useEffect, useState } from "react"
import { differenceInCalendarDays } from "date-fns";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { useContext } from "react";
import { UserContext } from "./UserContext";


const BookingWidget = ({ place }) => {
    // Almacenar el placeId en localStorage
    localStorage.setItem('placeId', place._id);
    console.log("se almacena ok", place._id)
    
    const [checkIn, setCheckIn] = useState("")
    const [checkOut, setCheckOut] = useState("")
    const [numberOfGuests, setNumberOfGuests] = useState(1)
    const [name, setName] = useState("")
    const [phone, setPhone] = useState("")
    const [redirect, setRedirect] = useState("")
    const [paymentMethod, setPaymentMethod] = useState("") // Estado para almacenar el método de pago seleccionado
    const { user } = useContext(UserContext)

    const [errors, setErrors] = useState({
        numberOfGuests: "",
        phone: ""
    })

    useEffect(() => {
        if (user && user.name) {
            setName(user.name);
        }
    }, [user]);

    let numberOfNights = 0

    if (checkIn && checkOut) {
        numberOfNights = differenceInCalendarDays(new Date(checkOut), new Date(checkIn))
    }

    const bookThisPlace = async () => {
        // Lógica de reserva
    }

    const handlePaymentMethodSelection = async (method) => {
        // Lógica de selección de método de pago
    }

    if (redirect) {
        return <Navigate to={redirect} />
    }

    const isLoggedIn = !!user; // Verifica si el usuario está autenticado

    console.log(checkIn, checkOut, numberOfGuests);

    return (
        <div className="bg-white shadow shadow-black p-4 rounded-2xl">
            <div className="text-2xl text-center">
                Price: ${place.price} / per night
            </div>
            <div className="border rounded-2xl mt-4">
                <div className="flex">
                    <div className="py-3 px-4">
                        <label>Check in</label>
                        <input type="date" value={checkIn} onChange={ev => setCheckIn(ev.target.value)} />
                    </div>
                    <div className="py-3 px-4">
                        <label>Check out</label>
                        <input type="date" value={checkOut} onChange={ev => setCheckOut(ev.target.value)} />
                    </div>
                </div>
                <div className="py-3 px-4 border-t">
                    <label>Number of guests</label>
                    <input type="number" min={1} max={place.guests} value={numberOfGuests} onChange={ev => setNumberOfGuests(ev.target.value)} />
                    {errors.numberOfGuests && <p className="text-red-600">{errors.numberOfGuests}</p>}
                </div>
                {numberOfNights > 0 && (
                    <div className="py-3 px-4 border-t">
                        <label>Your full name</label>
                        <input type="text" value={name} onChange={ev => setName(ev.target.value)} />
                        <label>Phone number</label>
                        <input type="tel" value={phone} onChange={ev => setPhone(ev.target.value)} />
                        {errors.phone && <p className="text-red-600">{errors.phone}</p>}
                        <div className="mt-4">
                            <p>Select payment method:</p>
                            <button onClick={isLoggedIn ? () => handlePaymentMethodSelection("mercadopago") : () => alert("Please log in to continue")} className={`mr-2 ${paymentMethod === "mercadopago" ? "bg-blue-500" : "bg-gray-300"} text-white py-2 px-4 rounded`}>Mercado Pago</button>
                            <button onClick={() => handlePaymentMethodSelection("onsite")} className={`mr-2 ${paymentMethod === "onsite" ? "bg-blue-500" : "bg-gray-300"} text-white py-2 px-4 rounded`}>Payment on-site</button>
                        </div>
                        {paymentMethod && (
                            <div className="mt-4">
                                <p>Selected payment method: {paymentMethod === "mercadopago" ? "Mercado Pago" : "Payment on-site"}</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <button onClick={bookThisPlace} className="primary mt-4">
                Book this place
                {numberOfNights > 0 && (
                    <span> for ${numberOfNights * place.price * numberOfGuests} for {numberOfNights} night</span>
                )}
            </button>
        </div>
    )
}

export default BookingWidget
