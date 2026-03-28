import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function ClientProposals({ job, user }) {
  const [proposals, setProposals] = useState([]);

  const fetchProposals = async () => {
    const { data } = await supabase.from("proposals").select("*").eq("job_id", job.id);
    setProposals(data);
  };

  useEffect(() => { fetchProposals(); }, [job.id]);

  const acceptProposal = async (p) => {
    const res = await fetch("/api/acceptProposal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ proposal_id: p.id, client_id: user.id }),
    });
    const data = await res.json();
    if (data.success) alert("Proposal accepted! Freelancer assigned.");
    fetchProposals();
  };

  return (
    <div>
      <h3>Proposals for {job.title}</h3>
      <ul>
        {proposals.map(p => (
          <li key={p.id}>
            Freelancer: {p.freelancer_id} | Amount: {p.amount} | Status: {p.status}
            {p.status === "pending" && <button onClick={() => acceptProposal(p)}>Accept</button>}
          </li>
        ))}
      </ul>
    </div>
  );
}
