import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    fetchJobs();
  }, []);

  async function fetchJobs() {
    const { data } = await supabase.from("jobs").select("*");
    setJobs(data || []);
  }

  async function createJob() {
    const { data: userData } = await supabase.auth.getUser();

    await supabase.from("jobs").insert({
      title,
      client_id: userData.user.id
    });

    setTitle("");
    fetchJobs();
  }

  return (
    <div>
      <h2>Jobs</h2>

      <input value={title} onChange={(e) => setTitle(e.target.value)} />
      <button onClick={createJob}>Post Job</button>

      {jobs.map(j => (
        <div key={j.id}>{j.title}</div>
      ))}
    </div>
  );
}