import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Signup.css";
import signImage from "../assets/signup.avif";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); 
  const [existingUser, setExistingUser] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/auth/signup", {
        userEmail: email,
        userPassword: password,
      });
      navigate("/login"); 
    } catch (error) {
      if (error.response && error.response.data.error === "User already exists") {
        setExistingUser(true);
        setError("User already exists. Please login.");
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="login-form-container">
          <h1 className="login-title">Create Account</h1>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSignup}>
            <div className="form-group">
              <input
                type="email"
                placeholder="Email"
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                placeholder="Password"
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="submit-button">Sign Up</button>
          </form>
          <div className="signup-option">
            <p>Already have an account? <Link to="/login" className="login-link">Log In</Link></p>
          </div>
        </div>
        <div className="login-illustration">
          <img 
            src={signImage} 
            alt="Login illustration" 
          />
        </div>
      </div>
    </div>
  );
};

export default Signup;