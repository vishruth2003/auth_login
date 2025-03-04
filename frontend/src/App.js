import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import Navbar from "./pages/Navbar";
import AuthGuard from "./pages/AuthGuard";
import Delegation from "./pages/Delegations.js";
import Report from "./pages/Report.js";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        <Route path="/home" element={<AuthGuard><Home /></AuthGuard>} />
        <Route path="/profile" element={<AuthGuard><Profile /></AuthGuard>} />
        <Route path="/delegation" element={<AuthGuard><Delegation /></AuthGuard>} />
        {/* <Route path="/checklist" element={<AuthGuard><Checklist /></AuthGuard>} /> */}
        <Route path="/report" element={<AuthGuard><Report /></AuthGuard>} />
      </Routes>
    </Router>
  );
}

export default App;
