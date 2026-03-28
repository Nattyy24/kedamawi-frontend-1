import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function ClientDashboard() {
  const [proposals, setProposals] = useState([]);

  useEffect(() => {
    fetchProposals();
  }, []);

  async function fetchProposals() {
    const { data, error } = await supabase
      .from("proposals")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setProposals(data);
  }

  return (
    <div style={{ marginTop: "40px" }}>
      <h2>Client Dashboard – Proposals</h2>

      {proposals.map((p) => (
        <div
          key={p.id}
          style={{
            border: "1px solid #ddd",
            padding: "20px",
            marginBottom: "20px"
          }}
        >
          <p><strong>Job ID:</strong> {p.job_id}</p>
          <p><strong>Proposal:</strong> {p.message}</p>
          <p><strong>Price:</strong> {p.price}</p>
        </div>
      ))}
    </div>
  );
}
