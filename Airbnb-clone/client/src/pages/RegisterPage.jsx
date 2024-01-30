import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios"

const RegisterPage = () => {

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const changeName = (e) => {
        setName(e.target.value)
    }

    const changeEmail = (e) => {
        setEmail(e.target.value)
    }

    const changePassword = (e) => {
        setPassword(e.target.value)
    }

    const registerUser = async (e) => {
        e.preventDefault()
        try {
            await axios.post("http://localhost:4000/register", {
                name,
                email,
                password
            }, { withCredentials: true })
            alert("Registration successful. Now you can log in")
        } catch (error) {
            console.log(error)
            alert("Registration failed. Please try again later")
        }

    }

    return (
        <div className="mt-4 grow flex items-center justify-around">
            <div className="mb-64">
                <h1 className="text-4xl text-center mb-4">Register</h1>
                <form className="max-w-md mx-auto" onSubmit={registerUser}>
                    <input type="text" placeholder="Tekilin" value={name} onChange={changeName} />
                    <input type="email" placeholder="your@gmail.com" value={email} onChange={changeEmail} />
                    <input type="password" placeholder="password" value={password} onChange={changePassword} />
                    <button className="primary">Register</button>
                    <div className="text-center py-2 text-gray-500">
                        Already a member? <Link className="underline text-bn" to={"/login"}>Login</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}
export default RegisterPage;