import axios from "axios"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { differenceInCalendarDays, format } from "date-fns"


const BookingPage = () => {

  const { id } = useParams()
  console.log("aca estoy en el booking",id)

  const [booking, setBookings] = useState([])
  const [showAllPhotos, setShowAllPhotos] = useState(false)

  useEffect(() => {
    axios.get("http://localhost:4000/bookings", { withCredentials: true })
      .then(res => {
        console.log("despues de la promesa",id)
        const foundBooking = res.data.find(({ _id }) => _id === id)
        if (foundBooking) {
          setBookings(foundBooking)
        }
      })
  }, [id])

  if (!booking) {
    return "";
  }

  console.log(booking);

  if (showAllPhotos) {
    return (
      <div className="absolute inset-0 bg-black text-white min-h-screen">
        <div className="bg-black p-8 grid gap-4">
          <div>
            <h2 className="text-3xl mr-48">Photos of {booking?.place?.title}</h2>
            <button onClick={() => setShowAllPhotos(false)} className="fixed right-12 top-8 flex gap-1 py-2 px-4 rounded-2xl shadow shadow-black bg-white text-black">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
              </svg>
              Close photos
            </button>
          </div>
          <div className="flex flex-col items-center gap-4">
            {booking?.place?.photos?.length > 0 && booking?.place?.photos.map((photo, index) => (
              <div className="" key={index}>
                <img className="w-[800px]" src={`http://localhost:4000/uploads/${photo}`} alt="" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-4 px-8 mx-5 mb-[150px]">
      <hr />
      <h1 className="text-3xl">{booking?.place?.title}</h1>
      <a className="flex gap-1 my-3 font-semibold underline" rel="noopener noreferrer" target="_blank" href={`https://maps.google.com/?q=${booking?.place?.address}`}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
        </svg>
        {booking?.place?.address}
      </a>
      <div className="relative">
        <div className="grid gap-2 grid-cols-[2fr_1fr] rounded-3xl overflow-hidden">
          <div>
            {booking?.place?.photos?.[0] && (
              <div>
                <img onClick={() => setShowAllPhotos(true)} className="cursor-pointer hover:opacity-90 aspect-square object-cover w-full" src={`http://localhost:4000/uploads/${booking?.place?.photos[0]}`} alt="" />
              </div>
            )}
          </div>
          <div className="grid">
            {booking?.place?.photos?.[1] && (
              <img onClick={() => setShowAllPhotos(true)} className="cursor-pointer hover:opacity-90 aspect-square object-cover w-full" src={`http://localhost:4000/uploads/${booking?.place?.photos[1]}`} alt="" />
            )}
            <div className="overflow-hidden">
              {booking?.place?.photos?.[2] && (
                <img onClick={() => setShowAllPhotos(true)} className="cursor-pointer hover:opacity-90 aspect-square object-cover relative top-2 w-full" src={`http://localhost:4000/uploads/${booking?.place?.photos[2]}`} alt="" />
              )}
            </div>
          </div>
        </div>
        <button onClick={() => setShowAllPhotos(true)} className="flex gap-1 absolute bottom-2 right-2 py-2 px-4 bg-white rounded-2xl shadow-md shadow-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z" clipRule="evenodd" />
          </svg>

          Show more photos
        </button>
      </div>

      <div className="mt-8 mb-8 grid gap-8 grid-cols-1 md:grid-cols-[2fr_1fr]">
        <div>
          <div className="my-4">
            <h2 className="font-semibold text-2xl">Description</h2>
            {booking?.place?.description}
          </div>
          Check-in: {booking?.place?.checkIn} <br />
          Check-out: {booking?.place?.checkOut} <br />
          Max number of guests: {booking?.place?.guests}
        </div>


        <div>
          <div className="bg-white shadow p-4 rounded-2xl">
            <div className="text-2xl text-center">
              Your booking information:
            </div>
            <div className="py-3 pr-3 grow ">
              <div className="flex gap-2 items-center border-t border-gray-300 mt-2 py-2">
                <div className="flex gap-1 items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
                  </svg>
                  {booking.checkIn && (
                    format(new Date(booking.checkIn), 'yyyy-MM-dd')
                  )}
                </div>
                &rarr;
                <div className="flex gap-1 items-center ">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
                  </svg>
                  {booking.checkOut && (
                    format(new Date(booking.checkOut), 'yyyy-MM-dd')
                  )}
                </div>
              </div>
              <div className="text-xl">
                <div className="flex gap-1 ">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
                  </svg>
                  Nights: {differenceInCalendarDays(new Date(booking?.checkOut), new Date(booking?.checkIn))}
                </div>
                <div className="flex gap-1 mt-2 items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                  </svg>
                  Guests: {booking?.numberOfGuests}
                </div>
                <div className="flex gap-1 mt-2 items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
                  </svg>
                  Total price: ${booking?.price}
                </div>
              </div>
            </div>
            <button className="primary mt-4">
              cancel reservation
            </button>
          </div>
        </div>


      </div>
      <div className="bg-white -mx-8 px-8 py-8 border-t">
        <div>
          <h2 className="font-semibold text-2xl">Extra info</h2>
        </div>
        <div className="mb-4 mt-2 text-sm text-gray-700 leading-5">{booking?.place?.extraInfo}</div>
      </div>
    </div>
  )
}

export default BookingPage