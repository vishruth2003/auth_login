import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Signup.css";
import signImage from "../assets/signup.avif";

const Signup = () => {
  useEffect(() => {
    document.title = "Signup";
  }, []);

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
    <div className="signup-container">
      <div className="signup-content">
        <div className="signup-form-container">
          <h1 className="signup-title">Create Account</h1>
          {error && <div className="signup-error-message">{error}</div>}
          <form onSubmit={handleSignup}>
            <div className="signup-form-group">
              <input
                type="email"
                placeholder="Email"
                className="signup-input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="signup-form-group">
              <input
                type="password"
                placeholder="Password"
                className="signup-input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="signup-submit-button">Sign Up</button>
          </form>
          <div className="signup-option">
            <p>Already have an account? <Link to="/login" className="signup-login-link">Log In</Link></p>
          </div>
        </div>
        <div className="signup-illustration">
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
