import { Link, Navigate, useParams } from "react-router-dom"
import AccountNav from "../components/AccountNav"
import { useEffect, useState } from "react"
import axios from "axios"
import Banner from "../components/Banner/Banner"
//hasta aquiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii kk


const PlacesPage = () => {

    const [places, setPlaces] = useState([])

    useEffect(() => {
        axios.get("http://localhost:4000/user-places", { withCredentials: true })
            .then(({ data }) => {
                setPlaces(data)
            })
    }, [])
    
    return (
        <div className="mb-[15px]">
            
            <AccountNav />
            
            <div className="text-center">
                <Link className="inline-flex gap-1 bg-primary text-black py-2 px-6 rounded-full hover:bg-yellow-400" to={"/account/places/new"}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>

                    Add new place
                </Link>
            </div>
            <div className="mt-4">
                {places.length > 0 && places.map(place => (
                    <Link key={place._id} to={"/account/places/" + place._id} className="flex mx-5 gap-4 shadow shadow-black p-4 rounded-2xl cursor-pointer mt-3" >
                        <div className="flex w-32 h-32 shrink-0">
                            {place.photos.length > 0 && (
                                <img className="object-cover" src={place.photos[0]} alt="" />
                            )}
                        </div>
                        <div className="grow-0 shrink">
                            <h2 className="text-xl">{place.title}</h2>
                            <p className="text-sm mt-2">{place.description}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default PlacesPage