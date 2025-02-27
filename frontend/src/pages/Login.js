import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "../styles/Login.css"; 
import loginImage from "../assets/login.jpeg";

const Login = () => {
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
        navigate("/home");
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
    <div className="login-container">
      <div className="login-content">
        <div className="login-form-container">
          <h1 className="login-title">User Login</h1>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <input
                type="email"
                className="input-field"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <input
                type="password"
                className="input-field"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <button type="submit" className="submit-button">Login</button>
            
            <div className="login-option">
              <p>Don't have an account? <Link to="/signup" className="signup-link">Sign up</Link></p>
            </div>
          </form>
        </div>
        
        <div className="login-illustration">
          <img 
            src={loginImage} 
            alt="Login illustration" 
          />
        </div>
      </div>
    </div>
  );
};

export default Login;