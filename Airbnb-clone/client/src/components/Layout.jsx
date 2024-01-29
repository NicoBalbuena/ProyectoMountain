import { Outlet } from "react-router-dom";
import Header from "./Header";
import Banner from "./Banner/Banner";
import Footer from "./Footer";


const Layout = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <Outlet />
            <Footer/>
        </div>
    )
}

export default Layout;