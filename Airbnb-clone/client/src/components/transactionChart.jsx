import { useState, useEffect } from "react"
import axios from "axios"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";


export const TransactionChart = () => {

  const [userData, setUserData] = useState([]);
  const [lodgingData, setLodgingData] = useState([]);
  const [userStats, setUserStats] = useState({ usersDeleted: 0, usersActive: 0 });
  const [placeStats, setPlaceStats] = useState({ placesDeleted: 0, placesActive: 0 });




  useEffect(() => {
    // Obtener datos de usuarios
    axios.get('http://localhost:4000/usersAll')
      .then((response) => {
        setUserData(response.data);

        const stats = {
          usersDeleted: response.data.filter(user => user.deleted).length,
          usersActive: response.data.filter(user => !user.deleted).length,
        };
        setUserStats(stats);
      });

      

    // Obtener datos de hospedajes
    axios.get('http://localhost:4000/placesAll')
      .then((response) => {
        const stats = {
          placesDeleted: response.data.filter(place => place.deleted).length,
          placesActive: response.data.filter(place => !place.deleted).length,
        };
        setPlaceStats(stats);
      });
  }, []);

  return (
    <>
    <div className="h-[22rem] bg-white p-4 rounded-sm border border-x-gray-200 flex flex-col ">
      <h2 className="text-yellow-500 font-medium text-lg">Users</h2>
      <div className="w-full  mt-3 flex flex-1 text-xs">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={300}
            data={[userStats]}
            margin={{ top: 20, right: 10, left: -10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3 0 0" vertical={false} />
            <XAxis dataKey="" />
            <YAxis/>
            <Tooltip />
            <Legend />
            <Bar dataKey="usersDeleted" fill="#FF0000" name="Users Deleted" />
            <Bar dataKey="usersActive" fill="#00FF00" name="Users Active" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  
    <div className="h-[22rem] bg-white p-4 rounded-sm border border-x-gray-200 flex flex-col ">
      <h2 className="text-yellow-500 font-medium text-lg">Lodgins</h2>
      <div className="w-full  mt-3 flex flex-1 text-xs">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={300}
            data={[placeStats]}
            margin={{ top: 20, right: 10, left: -10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3 0 0" vertical={false} />
            <XAxis dataKey="id" />
            <YAxis/>
            <Tooltip />
            <Legend />
            <Bar dataKey="placesDeleted" fill="#FF0000" name="Places Deleted" />
            <Bar dataKey="placesActive" fill="#00FF00" name="Places Active" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
    </>
  );
};
