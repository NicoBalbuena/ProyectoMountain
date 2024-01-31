import { useEffect, useState } from "react"
import { DashboardTable } from "../components/DashboardTable"
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
];
export const DashboardLodgings = () => {
    const [columns,setColumns] = useState([])
    const [data,setData] = useState([])

    useEffect(() => {
        if (lodgingsData.length > 0) {
            const firstRow = lodgingsData[0];
            const columnNames = Object.keys(firstRow);
            setColumns(columnNames);
            const rows = lodgingsData.map(row => Object.values(row));
            setData(rows);
        }
    }, []);
    return (
        <section className="flex flex-row gap-4 w-full overflow-hidden ">
            <DashboardTable columns={columns} data={data}/>
        </section>
    )
}