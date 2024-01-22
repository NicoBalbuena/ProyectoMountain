import { useEffect, useState } from "react"
import { Link, Navigate, useParams } from "react-router-dom"
import Perks from "../components/Perks"
import axios from "axios"
import AccountNav from "../components/AccountNav"

const PlacesFormPage = () => {

  const [redirect, setRedirect] = useState(false)
  const { id } = useParams()

  const [input, setInput] = useState({
    title: "",
    address: "",
    photos: [],
    photosLink: "",
    description: "",
    perks: [],
    extraInfo: "",
    checkIn: "",
    checkOut: "",
    guests: 1,
    price: 100,
  })

  useEffect(() => {
    if (!id) {
      return
    }
    axios.get("http://localhost:4000/places/" + id)
      .then(res => {
        const { data } = res;
        console.log(data, "jjjjj");
        setInput({
          title: data.title,
          address: data.address,
          photos: data.photos,
          photosLink: "",
          description: data.description,
          perks: data.perks,
          extraInfo: data.extraInfo,
          checkIn: data.checkIn,
          checkOut: data.checkOut,
          guests: data.guests,
          price: data.price
        })
      })
  }, [id])

  const handleChange = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value
    })
  }

  const addPhotoByLink = async (e) => {
    e.preventDefault()
    try {
      const { data: filename } = await axios.post("http://localhost:4000/uploads-by-link", { link: input.photosLink }, { withCredentials: true })
      setInput(prev => {
        return ({
          ...prev,
          photos: [...prev.photos, filename],
          photosLink: ""
        })
      })
      alert("Photo uploaded successfully")
    } catch (error) {
      alert("Error uploading photo")
    }
  }

  const uploadPhoto = (e) => {
    const files = e.target.files
    const data = new FormData()
    for (let i = 0; i < files.length; i++) {
      data.append("photos", files[i]);
    }
    axios.post("http://localhost:4000/upload/", data, { headers: { "Content-Type": "multipart/form-data" } }, { withCredentials: true })
      .then(res => {
        const { data: filenames } = res;
        setInput(prev => {
          return ({
            ...prev,
            photos: [...prev.photos, ...filenames],
          })
        })
      })
  }

  const handlePerksChange = (updatedPerks) => {
    setInput(prevInput => ({
      ...prevInput,
      perks: updatedPerks,
    }));
  }

  const savePlace = async (e) => {
    e.preventDefault()
    if (id) {
      await axios.put("http://localhost:4000/places", { data: input, id }, { withCredentials: true })
      setRedirect(true)
    } else {
      await axios.post("http://localhost:4000/places", { data: input }, { withCredentials: true })
      setRedirect(true)
    }
  }

  const removePhoto = (filename) => {
    setInput(prevInput => ({
      ...prevInput,
      photos: prevInput.photos.filter(photo => photo !== filename),
    }));
  };

  const selectAsMainPhoto = (filename) => {

    const newPhotos = [filename, ...input.photos.filter(photo => photo !== filename)]
    setInput(prevInput => ({
      ...prevInput,
      photos: newPhotos,
    }));
  }

  if (redirect) {
    return <Navigate to={"/account/places"} />
  }

  console.log(input.photosLink, "kkkkkkkkkkkkkkkk");

  return (
    <div>
      <AccountNav />
      <form onSubmit={savePlace}>
        <h2 className="text-2xl mt-4">Title</h2>
        <input type="text" placeholder="title, for example: My lovely apt" name="title" value={input.title} onChange={handleChange} />
        <h2 className="text-2xl mt-4">Address</h2>
        <input type="text" placeholder="address" name="address" value={input.address} onChange={handleChange} />
        <h2 className="text-2xl mt-4">Photos</h2>
        <div className="flex gap-2">
          <input type="text" placeholder="Add using a link .... jpg" name="photosLink" value={input.photosLink} onChange={handleChange} />
          <button onClick={addPhotoByLink} className="bg-gray-200 px-4 rounded-2xl">Add photo</button>
        </div>

        <div className="mt-2 grid gap-2 grid-cols-3 md:grid-cols-4 lg:grid-cols-6">

          {input.photos.length > 0 && input.photos.map(link => (
            <div key={link} className="h-32 flex relative">
              <img className="rounded-2xl object-cover w-full" src={"http://localhost:4000/uploads/" + link} alt="" />
              <button type="button" onClick={() => removePhoto(link)} className="cursor-pointer absolute bottom-1 right-1 text-white bg-black py-2 px-3 bg-opacity-50 rounded-2xl">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
              </button>
              <button type="button" onClick={() => selectAsMainPhoto(link)} className="cursor-pointer absolute bottom-1 left-1 text-white bg-black py-2 px-3 bg-opacity-50 rounded-2xl">
                {link === input.photos[0] && (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                  </svg>
                )}
                {link !== input.photos[0] && (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                  </svg>
                )}
              </button>
            </div>
          ))}

          <label className="h-32 cursor-pointer flex items-center gap-1 justify-center border bg-transparent rounded-2xl p-2 text-2xl text-gray-600">
            <input type="file" multiple className="hidden" onChange={uploadPhoto} />
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
            </svg>
            Upload
          </label>
        </div>
        <h2 className="text-2xl mt-4">Description</h2>
        <textarea placeholder="description of the place" name="description" value={input.description} onChange={handleChange} />
        <h2 className="text-2xl mt-4">Perks</h2>
        <p className="text-gray-500 text-sm">select all the perks of your place</p>
        <Perks selected={input.perks} onChange={handlePerksChange} />
        <h2 className="text-2xl mt-4">Extra info</h2>
        <textarea placeholder="house, rules, etc" name="extraInfo" value={input.extraInfo} onChange={handleChange} />
        <h2 className="text-2xl mt-4">Check in&out times</h2>
        <p className="text-gray-500 text-sm">add check in and out times, remember to have some time window for cleaning the room between guests</p>
        <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
          <div>
            <h3 className="mt-2 -mb-1 text-center">Check in time</h3>
            <input type="text" placeholder="14:00" name="checkIn" value={input.checkIn} onChange={handleChange} />
          </div>
          <div>
            <h3 className="mt-2 -mb-1 text-center">Check out time</h3>
            <input type="text" placeholder="11:00" name="checkOut" value={input.checkOut} onChange={handleChange} />
          </div>
          <div>
            <h3 className="mt-2 -mb-1 text-center">Max number of guests</h3>
            <input type="number" name="guests" value={input.guests} onChange={handleChange} />
          </div>
          <div>
            <h3 className="mt-2 -mb-1 text-center">Price per night</h3>
            <input type="number" name="price" value={input.price} onChange={handleChange} />
          </div>
        </div>


        <button className="primary my-4">Save</button>

      </form>
    </div>
  )
}

export default PlacesFormPage