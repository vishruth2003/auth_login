import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

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

  const redirectToLogin = () => {
    navigate("/login");
  };

  return (
    <div>
      <h1>Signup Page</h1>
      {error && <div style={{ color: "red" }}>{error}</div>} 
      <form onSubmit={handleSignup}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Sign Up</button>
      </form>

        <div>
          <button onClick={redirectToLogin}>Already have an account? Login</button>
        </div>

    </div>
  );
};

export default Signup;
