import { useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png"; 
import "./Navbar.css";  

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const hideHomeLink = location.pathname === "/login" || location.pathname === "/signup";

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true }); // Redirect to login after logout
  };

  return (
    <nav className="navbar">
      {hideHomeLink ? (
        <img src={logo} alt="Logo" className="logo" />
      ) : (
        <>
          <a href="/home">
            <img src={logo} alt="Logo" className="logo" />
          </a>
          {location.pathname !== "/login" && (
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          )}
        </>
      )}
    </nav>
  );
};

export default Navbar;
