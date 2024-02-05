import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../components/UserContext";
import { useNavigate } from 'react-router-dom';
import { gapi } from "gapi-script";
import GoogleLogin from 'react-google-login';
import Swal from "sweetalert2"

const LoginPage = () => {
    
    const client_id = "1056894336848-o8gs701t5oahl4ih6hi330t92kth6oa8.apps.googleusercontent.com";
    // eslint-disable-next-line no-unused-vars
    const [userGoogle, setUserGoogle] = useState({});
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [redirect, setRedirect] = useState(false);
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        const start = () => {
            gapi.auth2.init({
                client_id: client_id,
            });
        };
        gapi.load("client:auth2", start);
    }, []);

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(
                "http://localhost:4000/login",
                {
                    email,
                    password,
                },
                { withCredentials: true }
            );
            setUser(data);
    
            // Reemplaza el alert por SweetAlert2
            Swal.fire({
                title: "¡Welcome to Mountain Haven!",
                text: "¡Successful login!",
                icon: "success",
            }).then(() => {
                if (data.email === "admin@admin.com") {
                    navigate("/dashboard/main");
                }
                setRedirect(true);
            });
        } catch (error) {
            // Reemplaza el alert por SweetAlert2
            Swal.fire({
                title: "Error",
                text: error.response ? error.response.data : "Login failed. Please try again.",
                icon: "error",
            });
        }
    };

    const onSuccess = async (response) => {
        setUserGoogle(response.profileObj);
        const googleAccessToken = response.tokenId || response.accessToken;
        console.log(googleAccessToken);
        try {
            const { data } = await axios.post(
                "http://localhost:4000/auth/register/google",
                {
                    emailGoogle: response.profileObj.email,
                    nameGoogle: response.profileObj.name,
                    accessToken: googleAccessToken,
                },
                { withCredentials: true }
            );
            setUser(data);
            Swal.fire({
                title: "¡Welcome to Mountain Haven!",
                text: "¡Successful login!",
                icon: "success",
            }).then(() => {
                setRedirect(true);
            });
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: error.response ? error.response.data : "Login failed. Please try again.",
                icon: "error",
            });
        }
    };

    if (redirect) {
        navigate('/');
        return null;
    }

    return (
        <div className="mt-4 grow flex items-center justify-around">
            <div className="mb-64">
                <h1 className="text-4xl text-center mb-4">Login</h1>
                <form className="max-w-md mx-auto" onSubmit={handleLoginSubmit}>
                    <input
                        type="email"
                        placeholder="your@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button className="primary">Login</button>
                
                    <div className="mt-5 w-auto flex justify-center">
                        <GoogleLogin
                            className="flex justify-center w-96"
                            clientId={client_id}
                            onSuccess={onSuccess}
                            onFailure={() => console.log("Google login failed")}
                            cookiePolicy={"single_host_policy"}
                        />
                    </div>
                    <div className="text-center py-2 text-gray-500">
                        Do not have an account yet?{" "}
                        <Link className="underline text-bn" to={"/register"}>
                            Register now
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
