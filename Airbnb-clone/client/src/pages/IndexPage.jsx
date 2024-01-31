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

  useEffect(() => {
    fetchPlaces(); // Llamamos a la función para obtener los lugares cuando el componente se monta
  }, []);

  const fetchPlaces = async () => {
    try {
      const response = await axios.get("http://localhost:4000/placesAll/");
      setPlaces(response.data.filter((place) => !place.deleted)); // Actualizamos el estado con los lugares obtenidos
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
    <div className="mb-[150px]">
      <div>
        <Banner />
      </div>
      <div className="mx-6">
        <div className="mt-5">
          <h1>Filtros</h1>
          <button onClick={() => filterByAvgRating(5)}>Filter by rating promedio (5 estrellas)</button>
          <button onClick={() => filterByMinGuests(4)}>Filter by cantidad mínima de huéspedes (4 o más)</button>
          <button onClick={() => filterByAvailability("2024-02-01", "2024-02-07")}>Filtrar por disponibilidad </button>
        </div>
        <div>
          <select onChange={(e) => {
            const value = e.target.value;
            if (value === "clear") {
              handleClearSort();
            } else {
              handleSort(value);
            }
          }}>
            <option value="default">Ordenar por</option>
            <option value="price-desc">Precio (Desc)</option>
            <option value="price-asc">Precio (Asc)</option>
            <option value="guests-asc">Huéspedes (Asc)</option>
            <option value="guests-desc">Huéspedes (Desc)</option>
            <option value="review-asc">Review (Asc)</option>
            <option value="review-desc">Review (Desc)</option>
          </select>

        </div>
        <button onClick={handleClearSort}>Clear</button>
        <div className="mt-8 grid gap-x-6 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {(sortedPlaces.length > 0 ? sortedPlaces : places)
            .slice(pagesVisited, pagesVisited + placesPerPage)
            .map((place) => (
              <Link to={`/place/${place._id}`} key={place._id}>
                <div className="bg-gray-500 rounded-2xl flex mb-2">
                  {place.photos?.[0] && (
                    <img className="rounded-2xl object-cover aspect-square" src={ place.photos?.[0]} alt="" />
                  )}
                </div>
                <h2 className="font-bold">{place.address}</h2>
                <h3 className="text-sm truncate text-gray-500">{place.title}</h3>
                <div className="mt-1">
                  <span className="font-bold">${place.price}</span> per night
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
      </div>
    </div>
  );
};

export default IndexPage;
