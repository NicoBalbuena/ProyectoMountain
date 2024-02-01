import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Banner from "../components/Banner/Banner";
import ReactPaginate from "react-paginate";
import "./styles.css"; // Importa el archivo de estilos CSS

const IndexPage = () => {
  const [places, setPlaces] = useState([]);
  const [sortedPlaces, setSortedPlaces] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const placesPerPage = 4;
  const pagesVisited = pageNumber * placesPerPage;
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchPlaces(); // Llamamos a la función para obtener los lugares cuando el componente se monta
  }, []);

  const fetchPlaces = async () => {
    try {
      const response = await axios.get("http://localhost:4000/placesAll/");
      setPlaces(response.data.filter((place) => !place.deleted));
      const reviewsAll = await axios.get("http://localhost:4000/reviews/");
      setReviews(reviewsAll.data.reviews); // Actualizamos el estado con los lugares obtenidos
    } catch (error) {
      console.error("Error al obtener los lugares:", error);
    }
  };

  const handleSort = async (sortBy) => {
    try {
      const response = await axios.get(`http://localhost:4000/places/sort-by-${sortBy}`);
      setSortedPlaces(response.data); // Actualizamos el estado con los lugares ordenados
    } catch (error) {
      console.error(`Error al ordenar por ${sortBy}:`, error);
    }
  };

  const handleClearSort = async () => {
    fetchPlaces(); // Volvemos a obtener los lugares sin ningún ordenamiento
    setSortedPlaces([]); // Restablecemos los lugares ordenados a un arreglo vacío
  };


  const pageCount = Math.ceil(places.length / placesPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  // Función para filtrar lugares por rating promedio
  const filterByAvgRating = async (avgRating) => {
    try {
      const response = await axios.get(`http://localhost:4000/places/by-avg-rating/${avgRating}`);
      setPlaces(response.data); // Actualizamos el estado con los lugares filtrados
    } catch (error) {
      console.error("Error al filtrar por rating promedio:", error);
    }
  };

  // Función para filtrar lugares por cantidad mínima de huéspedes
  const filterByMinGuests = async (minGuests) => {
    try {
      const response = await axios.get(`http://localhost:4000/places/min-guests/${minGuests}`);
      setPlaces(response.data); // Actualizamos el estado con los lugares filtrados
    } catch (error) {
      console.error("Error al filtrar por cantidad mínima de huéspedes:", error);
    }
  };

  // Función para filtrar lugares disponibles por fechas de check-in y check-out
  const filterByAvailability = async (checkIn, checkOut) => {
    try {
      const response = await axios.get(`http://localhost:4000/places/available/${checkIn}/${checkOut}`);
      setPlaces(response.data); // Actualizamos el estado con los lugares filtrados
    } catch (error) {
      console.error("Error al filtrar por disponibilidad:", error);
    }
  };

  //limpiar filtros
  // eslint-disable-next-line no-unused-vars
  const handleClearFilters = async () => {
    fetchPlaces(); // Volvemos a obtener los lugares sin ningún filtro
  };

  return (
    <div className="mb-[20px]">
      <div>
        <Banner />
      </div>
      <div className="mx-6 ">
        <div className="mt-2 flex flex-col items-center" >
        <h2 className="font-semibold text-2xl">Filters</h2>
          <div className="flex items-center gap-5 px-10">
            <div className="my-2 flex justify-center gap-2">
              <button className="border border-black rounded-2xl p-1" onClick={() => filterByAvgRating(5)}>Filter by rating average(5 ⭐)</button>
              <button className="border border-black rounded-2xl p-1" onClick={() => filterByMinGuests(4)}>Filter by minimum number of guests (4 o más)</button>
              <button className="border border-black rounded-2xl p-1" onClick={() => filterByAvailability("2024-02-01", "2024-02-07")}>Filter by availability </button>
            </div>
            <div>
              <select className="bg-primary rounded-2xl p-2" onChange={(e) => {
                const value = e.target.value;
                if (value === "clear") {
                  handleClearSort();
                } else {
                  handleSort(value);
                }
              }}>
                <option className="bg-yellow-200" value="default">Sort by</option>
                <option className="bg-yellow-200" value="price-desc">Price (Desc)</option>
                <option className="bg-yellow-200" value="price-asc">Price (Asc)</option>
                <option className="bg-yellow-200" value="guests-asc">Guests (Asc)</option>
                <option className="bg-yellow-200" value="guests-desc">Guests (Desc)</option>
                <option className="bg-yellow-200" value="review-asc">Review (Asc)</option>
                <option className="bg-yellow-200" value="review-desc">Review (Desc)</option>
              </select>

            </div>
            <button className="flex border border-black rounded-2xl p-2 bg-primary" onClick={handleClearSort}>
              Clear
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>

            </button>
          </div>
        </div>
        <div className="mt-8 grid gap-x-12 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {(sortedPlaces.length > 0 ? sortedPlaces : places)
            .slice(pagesVisited, pagesVisited + placesPerPage)
            .map((place) => (
              <Link to={`/place/${place._id}`} key={place._id}>
                <div className=" rounded-2xl flex mb-2">
                  {place.photos?.[0] && (
                    <img className="rounded-2xl object-cover aspect-square w-full" src={place.photos?.[0]} alt="" />
                  )}
                </div>
                <div className="flex flex-col">
                  <div className="flex flex-col">
                    <h2 className="font-bold">{place.address}</h2>
                    <h3 className="text-sm truncate text-gray-500">{place.title}</h3>
                  </div>
                  <div className="mt-1 flex gap-1">
                    <span className="font-bold">${place.price} </span> 
                    <p>per night</p>
                  </div>
                  <div>
                    <p>Rating</p>
                    {console.log(place)}
                    </div>
                </div>
              </Link>
            ))}
        </div>
        <div className=" mt-7">
          <ReactPaginate
            className="flex justify-center gap-3"
            previousLabel={"Previous"}
            nextLabel={"Next"}
            pageCount={pageCount}
            onPageChange={changePage}
            containerClassName={"pagination"}
            previousLinkClassName={"pagination__link"}
            nextLinkClassName={"pagination__link"}
            disabledClassName={"pagination__link--disabled"}
            activeClassName={"pagination__link--active"}
          />
        </div>
        <div>
          <h1>Reseñas de nuestros usuarios</h1>
          { 
          reviews?.map((review, index)=> <div key={index}>
              {review?.reviewText && <h3>{review.reviewText}</h3>}
          </div>)}
        </div>
      </div>
    </div>
  );
};

export default IndexPage;
