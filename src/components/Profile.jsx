import { useState } from "react";
import { supabase } from "../supabaseClient";

export default function Profile() {
  const [name, setName] = useState("");
  const [skills, setSkills] = useState("");

  async function saveProfile() {
    const { error } = await supabase
      .from("profiles")
      .insert([{ name, skills }]);

    if (error) alert(error.message);
    else alert("Profile saved!");
  }

  return (
    <div style={{ marginTop: "40px" }}>
      <h2>Freelancer Profile</h2>

      <input
        placeholder="Your name"
        onChange={(e) => setName(e.target.value)}
      />

      <br /><br />

      <input
        placeholder="Your skills"
        onChange={(e) => setSkills(e.target.value)}
      />

      <br /><br />

      <button onClick={saveProfile}>Save Profile</button>
    </div>
  );
}
