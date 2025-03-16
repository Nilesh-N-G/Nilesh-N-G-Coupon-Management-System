import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import User from "./pages/User";
import Admin from "./pages/Admin";
import LoginPage from "./pages/LoginPage";

function App() {
  return (
    
    <Router> 
      <Routes>
        <Route path="/" element={<User />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;
