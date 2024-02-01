
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react"
import { differenceInCalendarDays } from "date-fns";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { useContext } from "react";
import { UserContext } from "./UserContext";


const BookingWidget = ({ place }) => {
    // Almacenar el placeId en localStorage
    localStorage.setItem('placeId', place._id);
    console.log("se almacena ok",place._id)
    console.log("se almacena ok",place._id)
    
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
        const newErrors = {}

        if (numberOfGuests > place.guests) {
            newErrors.numberOfGuests = "Exceeds the maximum number of guests"
        }

        if (!phone) {
            newErrors.phone = "Campo vacio"
        } 
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
        } else {
            const response = await axios.post("http://localhost:4000/bookings", {
                checkIn,
                checkOut, numberOfGuests, name, phone, place: place._id, price: numberOfNights * place.price * numberOfGuests
            }, { withCredentials: true })
            const bookingId = response.data._id
            setRedirect(`/account/bookings/${bookingId}`)
        }
        
    }

    const handlePaymentMethodSelection = async (method) => {
        if (!user) {
            // Si el usuario no está autenticado, mostrar un mensaje o redirigir a la página de inicio de sesión
            alert("Please log in to continue");
            return;
        }
    
        setPaymentMethod(method);
        if (method === "mercadopago") {
            try {
                // Calcular el precio total basado en el número de noches seleccionadas y el precio del lugar
                const totalPrice = numberOfNights * place.price * numberOfGuests;
    
                const response = await axios.post(
                    `http://localhost:4000/mp/create-order/${place._id}`,
                    {
                        name,
                        totalPrice, // Enviar el precio total a Mercado Pago
                    },
                    { withCredentials: true }
                );
                // Verificar si hay una URL de pago en la respuesta
                const paymentUrl = response.data.paymentUrl;
                if (paymentUrl) {
                    // Abrir la página de Mercado Pago en una nueva pestaña
                    window.open(paymentUrl, "_blank");
                } else {
                    console.error("No se recibió una URL de pago válida en la respuesta.");
                }
            } catch (error) {
                // Manejar errores de la solicitud
                console.error("Error:", error);
            }
        }
    }




    if (redirect) {
        return <Navigate to={redirect} />
    }

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
                            <button onClick={() => handlePaymentMethodSelection("mercadopago")} className={`mr-2 ${paymentMethod === "mercadopago" ? "bg-blue-500" : "bg-gray-300"} text-white py-2 px-4 rounded`}>Mercado Pago</button>
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
