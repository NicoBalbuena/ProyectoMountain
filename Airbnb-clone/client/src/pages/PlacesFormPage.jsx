import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import Perks from "../components/Perks";
import axios from "axios";
import AccountNav from "../components/AccountNav";

const PlacesFormPage = () => {
  const [redirect, setRedirect] = useState(false);
  const { id } = useParams();

  const [input, setInput] = useState({
    title: "",
    address: "",
    photos: [],
    description: "",
    perks: [],
    extraInfo: "",
    type: "",
    guests: 1,
    price: 100,
  });

  const [errors, setErrors] = useState({
    title: "",
    address: "",
    photos: "",
    description: "",
    perks: "",
    type: "",
    guests: "",
    price: ""
  })

  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get("http://localhost:4000/places/" + id).then((res) => {
      const { data } = res;
      console.log(data, "jjjjj");
      setInput({
        title: data.title,
        address: data.address,
        photos: data.photos,
        description: data.description,
        perks: data.perks,
        extraInfo: data.extraInfo,
        type: data.type,
        guests: data.guests,
        price: data.price,
      });
    });
  }, [id]);

  const handleType = (e) => {
    const { name } = e.target
    if (input.type === name) {
      setInput((prevInput) => ({
        ...prevInput,
        type: "",
      }));
    } else {
      setInput((prevInput) => ({
        ...prevInput,
        type: name,
      }));
    }
  }

  const handleChange = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };


  const uploadPhoto = (e) => {
    const files = e.target.files;
    const data = new FormData();
    for (let i = 0; i < files.length; i++) {
      data.append("photos", files[i]);
      console.log(files[i])
    }
    axios
      .post(
        "http://localhost:4000/upload", // Corregir la URL aquí
        data,
        { headers: { "Content-Type": "multipart/form-data" } }

      )
      .then((res) => {
        const { data: filenames } = res;
        setInput((prev) => {
          console.log(prev)
          return {
            ...prev,
            photos: [...prev.photos, ...filenames],
          };

        });
      })
      .catch((error) => {
        console.error("Error uploading photo: ", error);
      });
  };

  const handlePerksChange = (updatedPerks) => {
    setInput((prevInput) => ({
      ...prevInput,
      perks: updatedPerks,
    }));
  };

  const savePlace = async (e) => {
    e.preventDefault();
    const newErrors = {}

    if (input.title === "") {
      newErrors.title = "The field cannot be empty"
    }

    if (input.address === "") {
      newErrors.address = "The field cannot be empty";
    }

    if (input.photos.length < 5) {
      newErrors.photos = "You must have at least 5 photos"
    }

    if (input.description === "") {
      newErrors.description = "The field cannot be empty";
    }

    if (input.perks.length < 1) {
      newErrors.perks = "Select at least 1 service"
    }

    if (input.type === "") {
      newErrors.type = "You must select a type"
    }

    if (input.guests <= 0) {
      newErrors.guests = "Can't be 0"
    }

    if (input.guests > 10) {
      newErrors.guests = "Cannot be greater than 10"
    }

    if (input.price <= 0) {
      newErrors.price = "Can't be 0"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      alert("Fix your mistakes first")
    } else {
      try {
        if (id) {
          await axios.put(
            "http://localhost:4000/places",
            { data: input, id },
            { withCredentials: true }
          );
        } else {
          await axios.post(
            "http://localhost:4000/places",
            { data: input },
            { withCredentials: true }
          );
        }
        setRedirect(true);
      } catch (error) {
        console.error("Error saving place: ", error);
      }
    }
  };

  const removePhoto = (filename) => {
    setInput((prevInput) => ({
      ...prevInput,
      photos: prevInput.photos.filter((photo) => photo !== filename),
    }));
  };

  const selectAsMainPhoto = (filename) => {
    const newPhotos = [
      filename,
      ...input.photos.filter((photo) => photo !== filename),
    ];
    setInput((prevInput) => ({
      ...prevInput,
      photos: newPhotos,
    }));
  };


  console.log(input.type);

  if (redirect) {
    return <Navigate to={"/account/places"} />;
  }

  console.log(input, "estado");

  return (
    <div className="mb-[150px]">
      <AccountNav />
      <form onSubmit={savePlace} className="mx-52">
        <h2 className="text-2xl mt-4">Title</h2>
        <input
          type="text"
          placeholder="title, for example: My lovely apt"
          name="title"
          value={input.title}
          onChange={handleChange}
        />
        {errors.title && <p className="text-red-600">{errors.title}</p>}
        <h2 className="text-2xl mt-4">Address</h2>
        <input
          type="text"
          placeholder="address"
          name="address"
          value={input.address}
          onChange={handleChange}
        />
        {errors.address && <p className="text-red-600">{errors.address}</p>}
        <h2 className="text-2xl mt-4">Photos</h2>
        <div className="mt-2 grid gap-2 grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {input.photos.length > 0 &&
            input.photos.map((link) => (
              <div key={link} className="h-32 flex relative">
                <img
                  className="rounded-2xl object-cover w-full"
                  src={link}
                  alt=""
                />
                <button
                  type="button"
                  onClick={() => removePhoto(link)}
                  className="cursor-pointer absolute bottom-1 right-1 text-white bg-black py-2 px-3 bg-opacity-50 rounded-2xl"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => selectAsMainPhoto(link)}
                  className="cursor-pointer absolute bottom-1 left-1 text-white bg-black py-2 px-3 bg-opacity-50 rounded-2xl"
                >
                  {link === input.photos[0] && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  {link !== input.photos[0] && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            ))}

          <label className="h-32 cursor-pointer flex items-center gap-1 justify-center border bg-transparent rounded-2xl p-2 text-2xl text-gray-600">
            <input
              type="file"
              multiple
              className="hidden"
              onChange={uploadPhoto}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z"
              />
            </svg>
            Upload
          </label>
        </div>
        {errors.photos && <p className="text-red-600">{errors.photos}</p>}
        <h2 className="text-2xl mt-4">Description</h2>
        <textarea
          placeholder="description of the place"
          name="description"
          value={input.description}
          onChange={handleChange}
        />
        {errors.description && <p className="text-red-600">{errors.description}</p>}
        <h2 className="text-2xl mt-4">Perks</h2>
        <p className="text-gray-500 text-sm">
          select all the perks of your place
        </p>
        <Perks selected={input.perks} onChange={handlePerksChange} />
        {errors.perks && <p className="text-red-600">{errors.perks}</p>}
        <h2 className="text-2xl mt-4">Extra info</h2>
        <textarea
          placeholder="house, rules, etc"
          name="extraInfo"
          value={input.extraInfo}
          onChange={handleChange}
        />
        <h2 className="text-2xl mt-4">Types</h2>
        <p className="text-gray-500 text-sm">
          Which of these options best describes your accommodation?
        </p>
        <div className="grid grid-cols-3 gap-2">
          <button type="button" className={`w-full border my-1 py-2 px-3 rounded-2xl transition flex items-center justify-center gap-2 ${input.type === "house" ? "bg-primary" : "bg-transparent"} `} name="house" onClick={handleType}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
            House
          </button>
          <button type="button" className={`w-full border my-1 py-2 px-3 rounded-2xl transition flex items-center justify-center gap-2 ${input.type === "apartment" ? "bg-primary" : "bg-transparent"} `} name="apartment" onClick={handleType}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
            </svg>
            Apartment
          </button>
          <button type="button" className={`w-full border my-1 py-2 px-3 rounded-2xl transition flex items-center justify-center gap-2 ${input.type === "cabin" ? "bg-primary" : "bg-transparent"} `} name="cabin" onClick={handleType}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205 3 1m1.5.5-1.5-.5M6.75 7.364V3h-3v18m3-13.636 10.5-3.819" />
            </svg>
            cabin
          </button>
        </div>
        {errors.type && <p className="text-red-600">{errors.type}</p>}
        <h2 className="text-2xl mt-4">Guests & price</h2>
        <p className="text-gray-500 text-sm">
          How many people can stay here? & What will be the price per night?
        </p>
        <div className="grid gap-2 grid-cols-2 md:grid-cols-2">
          <div>
            <h3 className="mt-2 -mb-1 text-center">Max number of guests</h3>
            <input
              type="number"
              name="guests"
              value={input.guests}
              onChange={handleChange}
            />
            {errors.guests && <p className="text-red-600">{errors.guests}</p>}
          </div>
          <div>
            <h3 className="mt-2 -mb-1 text-center">Price per night</h3>
            <input
              type="number"
              name="price"
              value={input.price}
              onChange={handleChange}
            />
            {errors.price && <p className="text-red-600">{errors.price}</p>}
          </div>
        </div>

        <button className="primary my-4">Save</button>
      </form>
    </div>
  );
};

export default PlacesFormPage;
