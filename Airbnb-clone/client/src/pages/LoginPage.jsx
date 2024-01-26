import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../components/UserContext";
import { useNavigate } from 'react-router-dom';
import { gapi } from "gapi-script";
import GoogleLogin from 'react-google-login';

const LoginPage = () => {
  const client_id = "1056894336848-o8gs701t5oahl4ih6hi330t92kth6oa8.apps.googleusercontent.com";
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

  const onSuccess = async (response) => {
    console.log("obtengo respuesta",response)
    setUserGoogle(response.profileObj);
    try {
      const { data } = await axios.post(
        "http://localhost:4000/register", 
        {
          emailGoogle: response.profileObj.email,
          nameGoogle: response.profileObj.name,
        },
        { withCredentials: true }
      );
      setUser(data);
      alert("Login successful");
      setRedirect(true);
    } catch (error) {
      console.log(error)
      alert("Login failed");
    }
  };

  const onFailure = () => {
    console.log("Google login failed");
  };

  const changeEmail = (e) => {
    setEmail(e.target.value);
  };

  const changePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleLoginSubmit = async (e) => {
    console.log(event)
    e.preventDefault();
    try {
      console.log(data)
      const { data } = await axios.post(
        "http://localhost:4000/register",
        {
          email,
          password,
        },
        { withCredentials: true }
      );
      setUser(data);
      alert("Login successful");
      setRedirect(true);
    } catch (error) {
      alert("Login failed");
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
            onChange={changeEmail}
          />
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={changePassword}
          />
          <button className="primary">Login</button>
          <p>Or</p>
          <div>
            <GoogleLogin
              clientId={client_id}
              onSuccess={onSuccess}
              onFailure={onFailure}
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