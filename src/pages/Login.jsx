import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      navigate("/freelancer-profile");
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-gold text-xl mb-4">Login</h2>

      <form onSubmit={handleLogin} className="space-y-3">
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 text-black"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 text-black"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="btn-gold w-full">
          Login
        </button>
      </form>
    </div>
  );
}