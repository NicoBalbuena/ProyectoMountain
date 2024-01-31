import {
  HiOutlineViewGrid,
  HiOutlineUsers,
} from "react-icons/hi";
import { MdCabin } from "react-icons/md";
export const DASHBOARD_SIDEBAR_LINKS = [
    {
        key: "dashboard",
        label: "Dashboard",
        path: "/dashboard/main",
        icon: <HiOutlineViewGrid fontSize={24}/>
    },
    {
        key: "users",
        label: "Users",
        path: "/dashboard/users",
        icon: <HiOutlineUsers fontSize={24}/>
    },
    {
        key: "lodgings",
        label: "Lodgins",
        path: "/dashboard/lodgins",
        icon: <MdCabin fontSize={24}/>
    },
]
