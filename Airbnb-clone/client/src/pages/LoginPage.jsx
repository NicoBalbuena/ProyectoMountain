import { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../components/UserContext";
import { useNavigate } from 'react-router-dom'; // Importa useNavigate

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate(); // Usa useNavigate para la redirección

  const changeEmail = (e) => {
    setEmail(e.target.value);
  };

  const changePassword = (e) => {
    setPassword(e.target.value);
  };

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
      alert("Login successful");
      setRedirect(true);
    } catch (error) {
      alert("Login failed");
    }
  };

  const handleGoogleLogin = async () => {
    // Redirigir al usuario a la ruta de inicio de sesión de Google
    window.location.href = "http://localhost:4000/auth/login/google";
  };

  // Redirige a "/": la ruta que necesitas después del inicio de sesión exitoso
  if (redirect) {
    navigate('/');
    return null; // Puedes evitar renderizar cualquier contenido aquí
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
    
          <button type='button'  className="google-login" onClick={handleGoogleLogin}>
            Continue with Google
          </button>
          
          <div className="text-center py-2 text-gray-500">
            Don't have an account yet?{" "}
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
