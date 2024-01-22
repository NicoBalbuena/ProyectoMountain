import axios from "axios"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"


const PlacePage = () => {

    const { id } = useParams()
    const [place, setPlace] = useState(null)

    useEffect(() => {
        if(!id) {
            return
        }
        axios.get(`http://localhost:4000/places/${id}`)
        .then(res => {
            setPlace(res.data)
        })
    }, [id])

    if(!place) return;

    return (
        <div className="mt-4 bg-gray-100 -mx-8 px-8 py-8">
            <h1 className="text-2xl">{place.title}</h1>
            <a className="block font-semibold underline" target="_blank" href={`https://maps.google.com/?q=${place.address}`}>{place.address}</a>
        </div>
    )
}

export default PlacePage