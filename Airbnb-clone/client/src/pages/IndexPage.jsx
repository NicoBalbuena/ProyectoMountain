import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Banner from "../components/Banner/Banner";

const IndexPage = () => {
  const [places, setPlaces] = useState([]);
  const [sortBy, setSortBy] = useState(""); // Estado para controlar la selección actual del ordenamiento

  useEffect(() => {
    fetchPlaces(); // Llamamos a la función para obtener los lugares cuando el componente se monta
  }, []);

  const fetchPlaces = async () => {
    try {
      const response = await axios.get("http://localhost:4000/places/");
      setPlaces(response.data); // Actualizamos el estado con los lugares obtenidos
    } catch (error) {
      console.error("Error al obtener los lugares:", error);
    }
  };

  const handleSort = async (sortBy) => {
    try {
      const response = await axios.get(`http://localhost:4000/places/${sortBy}`);
      setPlaces(response.data); // Actualizamos el estado con los lugares ordenados según el tipo de ordenamiento
      setSortBy(sortBy); // Actualizamos el estado de la selección actual del ordenamiento
    } catch (error) {
      console.error(`Error al ordenar por ${sortBy}:`, error);
    }
  };

  const handleClearSort = async () => {
    fetchPlaces(); // Volvemos a obtener los lugares sin ningún ordenamiento
    setSortBy(""); // Restablecemos la selección actual del ordenamiento
  };

  return (
    <div>
      <div>
        <Banner />
      </div>
      <div>
        <select value={sortBy} onChange={(e) => handleSort(e.target.value)}>
          <option value="">Ordenar por</option>
          <option value="sort-by-price-desc">Price (Desc)</option>
          <option value="sort-by-price-asc">Price (Asc)</option>
          <option value="sort-by-guests-asc">Guests (Asc)</option>
          <option value="sort-by-guests-desc">Guests (Desc)</option>
          <option value="sort-by-review-asc">Review (Asc)</option>
          <option value="sort-by-review-desc">Review (Desc)</option>
        </select>
        <button onClick={handleClearSort}>Clear</button>
      </div>
      <div className="mt-8 grid gap-x-6 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {places.map((place) => (
          <Link to={`/place/${place._id}`} key={place._id}>
            <div className="bg-gray-500 rounded-2xl flex mb-2">
              {place.photos?.[0] && (
                <img className="rounded-2xl object-cover aspect-square" src={"http://localhost:4000/uploads/" + place.photos?.[0]} alt="" />
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
    </div>
  );
};

export default IndexPage;

