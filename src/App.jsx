import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { supabase } from "./supabaseClient";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import FreelancerProfile from "./pages/FreelancerProfile";
import EditProfile from "./pages/EditProfile";
import Wallet from "./pages/Wallet";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setLoadingUser(false);
    };

    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  if (loadingUser) return <p style={{ padding: "20px" }}>Loading app...</p>;

  return (
    <Router>
      <div style={{ padding: "40px", fontFamily: "Arial" }}>
        <h1>Kedamawi 🚀</h1>

        <nav style={{ marginBottom: "20px" }}>
          <Link to="/" style={{ marginRight: "10px" }}>Home</Link>
          <Link to="/freelancer-profile" style={{ marginRight: "10px" }}>Profile</Link>
          <Link to="/edit-profile" style={{ marginRight: "10px" }}>Edit Profile</Link>
          <Link to="/wallet" style={{ marginRight: "10px" }}>Wallet</Link>
          {!user && <Link to="/login" style={{ marginLeft: "10px" }}>Login</Link>}
          {!user && <Link to="/signup" style={{ marginLeft: "10px" }}>Signup</Link>}
        </nav>

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes */}
          <Route
            path="/freelancer-profile"
            element={
              <ProtectedRoute allowedRoles={["freelancer"]} user={user}>
                <FreelancerProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-profile"
            element={
              <ProtectedRoute allowedRoles={["freelancer","client"]} user={user}>
                <EditProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wallet"
            element={
              <ProtectedRoute allowedRoles={["freelancer"]} user={user}>
                <Wallet />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}
