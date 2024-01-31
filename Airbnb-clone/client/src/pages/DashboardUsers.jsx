/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import axios from "axios";


export const DashboardUsers = () => {

  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:4000/users").then((response) => {
      setUsers(response.data);
    });
  }, []);

  const handleDelete = async (placeId, value) => {
    try {
      // Realiza la solicitud DELETE al servidor
      const response = await axios.patch(
        `http://localhost:4000/users/${placeId}`,
        { value }
      );

      const { data } = await axios.get("http://localhost:4000/users");
      setUsers(data);
    } catch (error) {
      console.error("Error deleting row:", error);
    }
  };

  return (
    <section className="flex flex-row gap-4 w-full overflow-hidden ">
      <div className="">
        <h2>usuarios</h2>
        {users?.map((user, index) => (
          <div key={index}  className="">
            <span>NAME: {user.name}</span>
            <span>EMAIL: {user.email}</span>
            {user.deleted ? (
              <button
                className="border border-black bg-green-600"
                onClick={() => handleDelete(user._id, false)}
              >
                ACTIVAR
              </button>
            ) : (
              <button
                className="border border-black bg-red-600"
                onClick={() => handleDelete(user._id, true)}
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
