import { useEffect, useState } from "react";

import axios from "axios";

export const DashboardLodgings = () => {

  const [lodgings, setLodgings] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:4000/placesAll").then((response) => {
      setLodgings (response.data)});
  },[])

    //   // Definir las columnas que quieres mostrar
    //   const columnNames = [
    //     "Id",
    //     "Owner",
    //     "Title",
    //     "Address",
    //     "Perks",
    //     "Guests",
    //     "Price",
    //   ];

     
      // Transformar el array de objetos en un array bidimensional con los valores deseados
    //   const dataRows = dataArray.map((row) => [
    //     row._id,
    //     row.owner ? row.owner.toString() : "", // Convertir ObjectId a cadena si existe
    //     row.title || "",
    //     row.address || "",
    //     row.perks ? row.perks.join(", ") : "", // Unir perks si existen
    //     row.guests ? row.guests.toString() : "", // Convertir guests a cadena si existe
    //     row.price ? row.price.toString() : "", // Convertir price a cadena si existe
    //   ]);

 
  const handleDelete = async (placeId, value) => {
    try {
      // Realiza la solicitud DELETE al servidor
      const response =await axios.patch(
        `http://localhost:4000/places/${placeId}`,
      {value}
      );

      // Actualiza el estado eliminando la fila
      const {data} = await axios.get("http://localhost:4000/placesAll")
      setLodgings(data);
    }catch (error) {
      console.error("Error deleting row:", error);
    }
  };

  return (
    <section className="flex flex-row gap-4 w-full overflow-hidden ">
      <div className="">
        <h2>lodgings</h2>
        {lodgings?.map((lodging, index) => (
          <div  key={index} className="">
            <span>Title: {lodging.title}</span>
            <span>Owner: {lodging.owner}</span>
            <span>Address: {lodging.address}</span>
            {lodging.deleted ? (
              <button
                className="border border-black bg-green-600"
                onClick={() => handleDelete(lodging._id, false)}
              >
                ACTIVAR
              </button>
            ) : (
              <button
                className="border border-black bg-red-600"
                onClick={() => handleDelete(lodging._id, true)}
              >
                DESACTIVAR
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
