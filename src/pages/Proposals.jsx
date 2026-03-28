import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function Proposals({ jobId }) {
  const [proposals, setProposals] = useState([]);

  useEffect(() => {
    if (jobId) fetchProposals();
  }, [jobId]);

  async function fetchProposals() {
    const { data, error } = await supabase
      .from("proposals")
      .select("*")
      .eq("job_id", jobId);

    if (!error) setProposals(data);
  }

  async function hireFreelancer(p) {
    const { error } = await supabase.from("contracts").insert([
      {
        job_id: p.job_id,
        freelancer_id: p.freelancer_id,
        amount: p.bid_amount,
        status: "active"
      }
    ]);

    if (error) {
      alert(error.message);
    } else {
      alert("Freelancer hired!");
    }
  }

  return (
    <div style={{ marginTop: "40px" }}>
      <h2>Proposals</h2>

      {proposals.map((p) => (
        <div key={p.id} style={box}>
          <p>{p.cover_letter}</p>
          <strong>Bid: {p.bid_amount}</strong>

          <br /><br />

          <button onClick={() => hireFreelancer(p)}>
            Hire
          </button>
        </div>
      ))}
    </div>
  );
}

const box = {
  border: "1px solid #ddd",
  padding: "20px",
  marginBottom: "20px"
};
