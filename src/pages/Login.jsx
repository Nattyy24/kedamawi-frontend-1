import { useState } from "react";
import { supabase } from "../supabaseClient";

export default function Login() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithOtp({ email });

    if (error) {
      alert("Login failed: " + error.message);
    } else {
      alert("Check your email for the login link!");
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>Login 🚀</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: "8px", margin: "5px 0", width: "300px" }}
        />
        <br />
        <button type="submit" disabled={loading} style={{ padding: "10px 20px", marginTop: "10px" }}>
          {loading ? "Sending link..." : "Send Login Link"}
        </button>
      </form>
    </div>
  );
}
