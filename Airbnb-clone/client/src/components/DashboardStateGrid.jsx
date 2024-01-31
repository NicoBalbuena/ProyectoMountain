import { FaUsers } from "react-icons/fa";
import { FaUserTie } from "react-icons/fa";
import { IoHomeSharp } from "react-icons/io5";
import {useState, useEffect} from "react";
import axios from "axios";

export const DashboardState = () => {

  const [userData, setUserData] = useState([]);
  const [placeData, setPlaceData] = useState([]);

  const [prevUserData, setPrevUserData] = useState(null);
  const [prevPlaceData, setPrevPlaceData] = useState(null);
  useEffect(() => {
    // Obtener datos de usuarios
    axios.get("http://localhost:4000/usersAll").then((response) => {
      setPrevUserData((prevUserData) => {
        setUserData(response.data.length);
        return prevUserData !== null ? prevUserData : response.data.length;
      });
    });
  
    // Obtener datos de hospedajes
    axios.get("http://localhost:4000/placesAll").then((response) => {
      setPrevPlaceData((prevPlaceData) => {
        setPlaceData(response.data.length);
        return prevPlaceData !== null ? prevPlaceData : response.data.length;
      });
    });
  }, []); 

  
  const newUserCount = prevUserData !== null ? userData - prevUserData : 0;
  const newPlaceCount = prevPlaceData !== null ? placeData - prevPlaceData : 0;

    console.log(newUserCount);
    console.log(newPlaceCount);


  return (
    <div className="flex gap-4 w-full">
      <BoxWrapper>
        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-yellow-400">
          <FaUsers className="text-2x1 text-white" fontSize={24} />
        </div>
        <div className="pl-4">
          <span className="font-light text-sm text-gray-500">Total Users:</span>
          <div className="flex items-center">
            <strong className="text-xl text-gray-700 font-semibold">
              {userData}
            </strong>
            <span className="text-green-500 text-sm pl-2">+{newUserCount}</span>
          </div>
        </div>
      </BoxWrapper>
      <BoxWrapper>
        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-yellow-400">
          <IoHomeSharp className="text-2x1 text-white" fontSize={24} />
        </div>
        <div className="pl-4">
          <span className="font-light text-sm text-gray-500">
            Total lodgins:
          </span>
          <div className="flex items-center">
            <strong className="text-xl text-gray-700 font-semibold">
              {placeData}
            </strong>
            <span className="text-green-500 text-sm pl-2">+{newPlaceCount}</span>
          </div>
        </div>
      </BoxWrapper>
    </div>
  );
};

function BoxWrapper({ children }) {
  return (
    <div className="bg-white rounded-sm p-4 flex-1 border border-gray-200 flex items-center">
      {children}{" "}
    </div>
  );
}
