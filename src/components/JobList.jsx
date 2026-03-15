import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function JobList() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetchJobs();
  }, []);

  async function fetchJobs() {
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) {
      setJobs(data);
    }
  }

  async function applyToJob(jobId) {
    const message = prompt("Write your proposal");
    const price = prompt("Your price");

    const { error } = await supabase
      .from("proposals")
      .insert([{ job_id: jobId, message, price }]);

    if (error) {
      alert(error.message);
    } else {
      alert("Proposal sent!");
    }
  }

  return (
    <div style={{ marginTop: "40px" }}>
      <h2>Available Jobs</h2>

      {jobs.map((job) => (
        <div
          key={job.id}
          style={{
            border: "1px solid #ddd",
            padding: "20px",
            marginBottom: "20px"
          }}
        >
          <h3>{job.title}</h3>
          <p>{job.description}</p>
          <strong>Budget: {job.budget}</strong>

          <br /><br />

          <button onClick={() => applyToJob(job.id)}>
            Apply
          </button>
        </div>
      ))}
    </div>
  );
}
