import { useContext, useState } from "react"
import { UserContext } from "../components/UserContext"
import { Link, Navigate, useParams } from "react-router-dom"
import axios from "axios"
import PlacesPage from "./PlacesPage"
import AccountNav from "../components/AccountNav"
//hasta aquiiiiiiiiiiiiiiiiiiiiiiiii kk


const AccountPage = () => {

  const [redirect, setRedirect] = useState(null)
  const { ready, user, setUser } = useContext(UserContext)
  let { subpage } = useParams()
  if (subpage === undefined) {
    subpage = "profile"
  }

  const logout = async () => {
    await axios.post("http://localhost:4000/logout", {}, { withCredentials: true })
    setRedirect("/")
    setUser(null)
  }

  if (!ready) {
    return "Loading..."
  }

  if (ready && !user && !redirect) {
    return <Navigate to={"/login"} />
  }



  if (redirect) {
    return <Navigate to={redirect} />
  }

  return (
    <div>
      <AccountNav isAdmin={user.email === "admin@admin.com"}/>

      {subpage === "profile" && (
        <div className="text-center max-w-lg mx-auto">
          Logged in as {user.name} ({user.email}) <br />
          <button onClick={logout} className="primary max-w-sm mt-2">Logout</button>
        </div>
      )}

      {subpage === "places" && (
        <PlacesPage />
      )}
    </div>
  )
}

export default AccountPage;