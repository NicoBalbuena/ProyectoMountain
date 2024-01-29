const PlaceImg = ({ place }) => {

    if (!place.photos?.length) {
        return ""
    }

    return (
        <img className="object-cover" src={place.photos[0]} alt="" />

    )
}

export default PlaceImg