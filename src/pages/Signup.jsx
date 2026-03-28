import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("freelancer");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1️⃣ Sign up user with Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;

      // 2️⃣ Create profile in "profiles" table
      const { error: profileError } = await supabase.from("profiles").insert([
        { id: data.user.id, email: data.user.email, role },
      ]);
      if (profileError) throw profileError;

      // 3️⃣ Auto-create wallet for freelancers
      if (role === "freelancer") {
        const { error: walletError } = await supabase.from("wallets").insert([
          { user_id: data.user.id, balance: 0 },
        ]);
        if (walletError) throw walletError;
      }

      alert("Signup successful! Check your email to login.");
      navigate("/login");
    } catch (err) {
      alert("Signup failed: " + err.message);
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>Sign Up 🚀</h2>
      <form onSubmit={handleSignup}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: "8px", margin: "5px 0", width: "300px" }}
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: "8px", margin: "5px 0", width: "300px" }}
        />
        <br />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={{ padding: "8px", margin: "5px 0", width: "320px" }}
        >
          <option value="freelancer">Freelancer</option>
          <option value="client">Client</option>
        </select>
        <br />
        <button type="submit" disabled={loading} style={{ padding: "10px 20px", marginTop: "10px" }}>
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
}
