import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Tasks from "./pages/Tasks.js";
import Navbar from "./pages/Navbar";
import AuthGuard from "./pages/AuthGuard";
import Delegation from "./pages/Delegations.js";
import Report from "./pages/Report.js";
import Checklist from "./pages/Checklist.js";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/tasks" element={<AuthGuard><Tasks /></AuthGuard>} />
        <Route path="/profile" element={<AuthGuard><Profile /></AuthGuard>} />
        <Route path="/delegation" element={<AuthGuard><Delegation /></AuthGuard>} />
        <Route path="/checklist" element={<AuthGuard><Checklist /></AuthGuard>} />
        <Route path="/report" element={<AuthGuard><Report /></AuthGuard>} />
        <Route path="/dashboard" element={<AuthGuard><Dashboard /></AuthGuard>} /> 
      </Routes>
    </Router>
  );
}

export default App;
