import { useState } from "react";
import { supabase } from "../supabaseClient";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function signUp() {
    const { error } = await supabase.auth.signUp({
      email: email,
      password: password
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Account created successfully!");
    }
  }

  return (
    <div style={{marginTop:"30px"}}>
      <h2>Create Account</h2>

      <input
        type="email"
        placeholder="Email"
        onChange={(e)=>setEmail(e.target.value)}
      />

      <br/><br/>

      <input
        type="password"
        placeholder="Password"
        onChange={(e)=>setPassword(e.target.value)}
      />

      <br/><br/>

      <button onClick={signUp}>
        Sign Up
      </button>
    </div>
  );
}
