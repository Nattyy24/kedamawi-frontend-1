import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Home from "./pages/Home";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-primary text-white">

        {/* NAVBAR */}
        <nav className="flex justify-between items-center p-6 border-b border-gray-800">
          <h1 className="text-xl font-bold text-gold">Kedamawi</h1>

          <div className="space-x-4">
            <Link to="/" className="hover:text-gold">Home</Link>
            <Link to="/freelancer-profile" className="hover:text-gold">Profile</Link>
            <Link to="/wallet" className="hover:text-gold">Wallet</Link>
          </div>
        </nav>

        {/* ROUTES */}
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>

      </div>
    </Router>
  );
}