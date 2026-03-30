import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { supabase } from "./supabaseClient";

import Wallet from "./pages/Wallet";
import FreelancerProfile from "./pages/FreelancerProfile";
import EditProfile from "./pages/EditProfile";
import Jobs from "./pages/Jobs";
import Chat from "./pages/Chat";

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkUser();

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      checkUser();
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  async function checkUser() {
    const { data } = await supabase.auth.getUser();
    setUser(data?.user || null);
  }

  async function logout() {
    await supabase.auth.signOut();
    setUser(null);
  }

  return (
    <Router>
      <div className="p-6 bg-[#121212] text-white min-h-screen">

        {/* NAVBAR */}
        <nav className="flex gap-4 mb-6">
          <Link to="/">Home</Link>

          {user && (
            <>
              <Link to="/freelancer-profile">Profile</Link>
              <Link to="/wallet">Wallet</Link>
              <Link to="/jobs">Jobs</Link>
              <Link to="/chat">Chat</Link>
              <button onClick={logout}>Logout</button>
            </>
          )}

          {!user && (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Signup</Link>
            </>
          )}
        </nav>

        <Routes>
          <Route path="/" element={<h1>Kedamawi 🚀</h1>} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/freelancer-profile" element={<FreelancerProfile />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </div>
    </Router>
  );
}