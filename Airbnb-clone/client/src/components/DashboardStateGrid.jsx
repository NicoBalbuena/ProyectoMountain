import { FaUsers } from "react-icons/fa";
import { FaUserTie } from "react-icons/fa";
import { IoHomeSharp } from "react-icons/io5";
export const DashboardState = () => {
  return (
    <div className="flex gap-4 w-full">
      <BoxWrapper>
        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-pink-500">
          <FaUsers className="text-2x1 text-white" fontSize={24} />
        </div>
        <div className="pl-4">
          <span className="font-light text-sm text-gray-500">Total Users:</span>
          <div className="flex items-center">
            <strong className="text-xl text-gray-700 font-semibold">
              12412421
            </strong>
            <span className="text-green-500 text-sm pl-2">+243</span>
          </div>
        </div>
      </BoxWrapper>
      <BoxWrapper>
        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-pink-500">
          <FaUserTie className="text-2x1 text-white" fontSize={24} />
        </div>
        <div className="pl-4">
          <span className="font-light text-sm text-gray-500">Total ownes:</span>
          <div className="flex items-center">
            <strong className="text-xl text-gray-700 font-semibold">
              12412421
            </strong>
            <span className="text-green-500 text-sm pl-2">+243</span>
          </div>
        </div>
      </BoxWrapper>
      <BoxWrapper>
        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-pink-500">
          <IoHomeSharp className="text-2x1 text-white" fontSize={24} />
        </div>
        <div className="pl-4">
          <span className="font-light text-sm text-gray-500">
            Total lodgins:
          </span>
          <div className="flex items-center">
            <strong className="text-xl text-gray-700 font-semibold">
              12412421
            </strong>
            <span className="text-green-500 text-sm pl-2">+243</span>
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
