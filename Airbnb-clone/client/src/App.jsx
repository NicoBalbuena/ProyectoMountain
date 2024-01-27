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
import Dashboard from "./pages/DashboardPage"


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
        </Route>
        /*Dashboard */
          <Route path="/dashboard" element={<Dashboard/>}>
          <Route path="/dashboard/users" element={<Dashboard/>}/>
          <Route path="/dashboard/lodgins" element={<Dashboard/>}/>
          <Route path="/dashboard/owners" element={<Dashboard/>}/>
          </Route>
      </Routes>
    </UserContextProvider>
  )
}

export default App
