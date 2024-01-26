import { useEffect } from "react";
import axios from "axios";

const ProtectedComponent = () => {
  useEffect(() => {
    // Recuperar el accessToken del localStorage
    const accessToken = localStorage.getItem('accessToken');

    // Usar el accessToken como encabezado de autorización en una solicitud
    axios.get('http://localhost:4000/api/data', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
      .then(response => {
        // Manejar la respuesta del backend
      })
      .catch(error => {
        // Manejar el error de la solicitud (puede ser porque el token ha expirado, etc.)
      });
  }, []);

  return (
    <div>Contenido protegido que requiere autenticación</div>
  );
};

export default ProtectedComponent;
