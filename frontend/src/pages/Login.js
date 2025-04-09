import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "../styles/Login.css"; 
import loginImage from "../assets/login.jpeg";

const Login = () => {
  useEffect(() => {
    document.title = "Login";
  }, []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/auth/login", {
        userEmail: email,
        userPassword: password,
      });

      localStorage.setItem("token", response.data.token);

      if (response.data.isNewUser) {
        navigate("/profile");
      } else {
        navigate("/tasks");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError("Invalid email or password");
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-page-content">
        <div className="login-form-wrapper">
          <h1 className="login-heading">User Login</h1>

          {error && <div className="login-error-msg">{error}</div>}

          <form onSubmit={handleLogin}>
            <div className="login-input-group">
              <input
                type="email"
                className="login-input-field"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="login-input-group">
              <input
                type="password"
                className="login-input-field"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="login-submit-btn">Login</button>

            <div className="login-extra-option">
              <p>
                Don't have an account?{" "}
                <Link to="/signup" className="login-signup-link">Sign up</Link>
              </p>
            </div>
          </form>
        </div>

        <div className="login-image-container">
          <img src={loginImage} alt="Login illustration" />
        </div>
      </div>
    </div>
  );
};

export default Login;
