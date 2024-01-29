import { Outlet } from "react-router-dom";
import Header from "./Header";
import Banner from "./Banner/Banner";


const Layout = () => {
    return (
        <div className="py-4 px-8 flex flex-col min-h-screen">
            <Header />
            
            <Outlet />
        </div>
    )
}

export default Layout;