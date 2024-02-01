import { Routes, Route } from "react-router-dom"
import IndexPage from "./pages/IndexPage"
import LoginPage from "./pages/LoginPage"
import Layout from "./components/Layout"
import RegisterPage from "./pages/RegisterPage"
import { UserContextProvider } from "./components/UserContext"
import AccountPage from "./pages/AccountPage"
import PlacesPage from "./pages/PlacesPage"
import PlacesFormPage from "./pages/PlacesFormPage"
import PlacePage from "./pages/PlacePage"
import BookingsPage from "./pages/BookingsPage"
import BookingPage from "./pages/BookingPage"
import DashboardIndex from "./pages/DashboardPage"
import { DashboardMain } from "./pages/DashboardMain"
import { DashboardUsers } from "./pages/DashboardUsers"
import { DashboardLodgings } from "./pages/DashboardLodgings"
import About from "./pages/About"


function App() {

  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<IndexPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/account/places" element={<PlacesPage />} />
          <Route path="/account/places/new" element={<PlacesFormPage />} />
          <Route path="/account/places/:id" element={<PlacesFormPage />} />
          <Route path="/place/:id" element={<PlacePage />} />
          <Route path="/account/bookings" element={<BookingsPage />} />
          <Route path="/account/bookings/:id" element={<BookingPage />} />
          <Route path="/about" element={<About/>} />
        </Route>
      
          <Route path="/dashboard" element={<DashboardIndex/>}>
          <Route path="/dashboard/users" element={<DashboardUsers/>}/>
          <Route path="/dashboard/lodgins" element={<DashboardLodgings/>}/>
          
          <Route path="/dashboard/main" element={<DashboardMain/>}/>
          </Route>
      </Routes>
    </UserContextProvider>
  )
}

export default App
