import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";

import FreelancerProfile from "./pages/FreelancerProfile";
import EditProfile from "./pages/EditProfile";
import Wallet from "./pages/Wallet";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

export default function App() {
  return (
    <Router>
      <div className="p-6">

        <h1 className="text-3xl text-gold mb-6">
          Kedamawi 🚀
        </h1>

        {/* 🔥 NAVBAR */}
        <nav className="mb-6 space-x-3">
         <Link to="/">Home</Link>
         <Link to="/freelancer-profile">Profile</Link>
         <Link to="/edit-profile">Edit Profile</Link>
         <Link to="/wallet">Wallet</Link>
         <Link to="/login">Login</Link>
         <Link to="/signup">Signup</Link>
        </nav>

        <Routes>
          <Route path="/" element={<p>Welcome 👋</p>} />
          <Route path="/freelancer-profile" element={<FreelancerProfile />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </Router>
  );
}