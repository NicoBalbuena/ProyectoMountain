import { useState, useEffect } from "react"
import axios from "axios"
import { DashboardTable } from "../components/DashboardTable"

export const DashboardUsers = () => {
        const [columns,setColumns] = useState([])
        const [data,setData] = useState([])
    
        useEffect(() => {
            axios.get('http://localhost:4000/users')
            .then((response) => {
                const dataArray = Array.isArray(response.data) ? response.data : [];
    
                    // Definir las columnas que quieres mostrar
                    const columnNames = ['Id', 'Name', 'Email'];
    
                    setColumns(columnNames);
    
                    // Transformar el array de objetos en un array bidimensional con los valores deseados
                    const dataRows = dataArray.map(row => [
                        row._id,
                        row.name? row.name.toString() : '', // Convertir ObjectId a cadena si existe
                        row.email || '',
                    ]);
    
                    setData(dataRows);
            })
        
        }, []);
    
    
        const handleDeleteRow = async (rowIndex, placeId) => {
            console.log(placeId);
            try {
              // Realiza la solicitud DELETE al servidor
            await axios.delete(`http://localhost:4000/users/${placeId}`);
        
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
