import { useEffect } from "react";
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
  useEffect(() => {
    // Use sessionStorage to detect tab/browser closing vs refreshing
    // sessionStorage persists during page refreshes but clears when the tab/browser is closed
    
    // When the app starts, check if we have a session
    if (!sessionStorage.getItem("appSession")) {
      // No session exists, which means either:
      // 1. This is the first load of the app
      // 2. The browser/tab was closed and reopened
      
      // Check if the user was logged in (token exists in localStorage)
      const token = localStorage.getItem("token");
      if (token) {
        // User was logged in but the browser/tab was closed
        // Now they're back in a new session - clear their data
        localStorage.clear();
      }
      
      // Start a new session
      sessionStorage.setItem("appSession", "active");
    }
    
    // Normal app initialization continues...
  }, []);

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