import { useState } from "react";
import { supabase } from "../supabaseClient";

export default function PostJob() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");

  async function createJob() {
    const { error } = await supabase.from("jobs").insert([
      {
        title: title,
        description: description,
        budget: budget
      }
    ]);

    if (error) {
      alert(error.message);
    } else {
      alert("Job posted successfully!");
    }
  }

  return (
    <div style={{marginTop:"40px"}}>
      <h2>Post a Job</h2>

      <input
        placeholder="Job title"
        onChange={(e)=>setTitle(e.target.value)}
      />

      <br/><br/>

      <textarea
        placeholder="Job description"
        onChange={(e)=>setDescription(e.target.value)}
      />

      <br/><br/>

      <input
        placeholder="Budget"
        onChange={(e)=>setBudget(e.target.value)}
      />

      <br/><br/>

      <button onClick={createJob}>
        Post Job
      </button>
    </div>
  );
}
