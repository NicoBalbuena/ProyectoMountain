import { useEffect, useState } from "react"
import { DashboardTable } from "../components/DashboardTable"
import axios from "axios";
const lodgingsData = [
    {
        "id": "1",
        "owner": "60f2e0490c19830015db01c9",
        "title": "Hermosa Casa en la Playa",
        "address": "Calle Principal 123, Ciudad",
        "description": "Esta hermosa casa se encuentra justo en la playa, con impresionantes vistas al mar.",
        "perks": ["Piscina", "Cocina completa", "Wi-Fi"],
        "extraInfo": "Se admiten mascotas con un cargo adicional.",
        "checkIn": 14,
        "checkOut": 10,
        "guests": 6,
        "price": 200,
        "reviews": ["60f2e0490c19830015db01ca", "60f2e0490c19830015db01cb"]
    },
    {
        "id": "2",
        "owner": "60f2e0490c19830015db01ca",
        "title": "Cabaña Acogedora en la Montaña",
        "address": "Camino a la Montaña 456, Pueblo",
        "description": "Esta cabaña ofrece una escapada tranquila en la montaña, perfecta para relajarse y desconectar.",
        "perks": ["Chimenea", "Terraza", "Vistas panorámicas"],
        "extraInfo": "No se permiten mascotas.",
        "checkIn": 15,
        "checkOut": 11,
        "guests": 4,
        "price": 150,
        "reviews": ["60f2e0490c19830015db01cc"]
    },
    {
        "id": "1",
        //"owner": "60f2e0490c19830015db01c9",
        "title": "Hermosa Casa en la Playa",
        "address": "Calle Principal 123, Ciudad",
        //"description": "Esta hermosa casa se encuentra justo en la playa, con impresionantes vistas al mar.",
        //"perks": ["Piscina", "Cocina completa", "Wi-Fi"],
        //"extraInfo": "Se admiten mascotas con un cargo adicional.",
        "checkIn": 14,
        "checkOut": 10,
        //"guests": 6,
        //"price": 200,
        //"reviews": ["60f2e0490c19830015db01ca", "60f2e0490c19830015db01cb"]
    },
    {
        //"id": "1",
        "owner": "60f2e0490c19830015db01c9",
        "title": "Hermosa Casa en la Playa",
        "address": "Calle Principal 123, Ciudad",
        //"description": "Esta hermosa casa se encuentra justo en la playa, con impresionantes vistas al mar.",
        "perks": ["Piscina", "Cocina completa", "Wi-Fi"],
        //"extraInfo": "Se admiten mascotas con un cargo adicional.",
        //"checkIn": 14,
        //"checkOut": 10,
        "guests": 6,
        "price": 200,
        //"reviews": ["60f2e0490c19830015db01ca", "60f2e0490c19830015db01cb"]
    },
];
export const DashboardLodgings = () => {
    const [columns,setColumns] = useState([])
    const [data,setData] = useState([])

    useEffect(() => {
        axios.get('http://localhost:4000/places')
        .then((response) => {
            const dataArray = Array.isArray(response.data) ? response.data : [];

                // Definir las columnas que quieres mostrar
                const columnNames = ['Id', 'Owner', 'Title', 'Address', 'Perks', 'Guests', 'Price'];

                setColumns(columnNames);

                // Transformar el array de objetos en un array bidimensional con los valores deseados
                const dataRows = dataArray.map(row => [
                    row._id,
                    row.owner ? row.owner.toString() : '', // Convertir ObjectId a cadena si existe
                    row.title || '',
                    row.address || '',
                    row.perks ? row.perks.join(', ') : '', // Unir perks si existen
                    row.guests ? row.guests.toString() : '', // Convertir guests a cadena si existe
                    row.price ? row.price.toString() : '', // Convertir price a cadena si existe
                ]);

                setData(dataRows);
        })
    
    }, []);


    const handleDeleteRow = async (rowIndex, placeId) => {
        console.log(placeId);
        try {
          // Realiza la solicitud DELETE al servidor
          await axios.delete(`http://localhost:4000/places/${placeId}`);
    
          // Actualiza el estado eliminando la fila
          const newData = [...data];
          newData.splice(rowIndex, 1); // Elimina la fila en el índice rowIndex
          setData(newData);
        } catch (error) {
            console.error('Error deleting row:', error);
        }
      };

    console.log(data);
    return (
        <section className="flex flex-row gap-4 w-full overflow-hidden ">
            <DashboardTable columns={columns} data={data} onDeleteRow={handleDeleteRow}/>
        </section>
    )
}