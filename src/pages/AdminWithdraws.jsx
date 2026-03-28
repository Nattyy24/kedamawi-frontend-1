import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export default function AdminWithdraws() {
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    const { data } = await supabase.from("withdraw_requests").select("*").eq("status", "pending");
    setRequests(data);
  };

  useEffect(() => { fetchRequests(); }, []);

  const approve = async (r) => {
    const { data: wallet } = await supabase.from("wallets").select("*").eq("user_id", r.user_id).single();
    await supabase.from("wallets").update({ balance: wallet.balance - r.amount }).eq("user_id", r.user_id);
    await supabase.from("withdraw_requests").update({ status: "approved", processed_at: new Date() }).eq("id", r.id);
    fetchRequests();
  };

  const reject = async (r) => {
    await supabase.from("withdraw_requests").update({ status: "rejected", processed_at: new Date() }).eq("id", r.id);
    fetchRequests();
  };

  return (
    <div>
      <h2>Pending Withdraw Requests</h2>
      <ul>
        {requests.map(r => (
          <li key={r.id}>
            User: {r.user_id} | Amount: {r.amount} {r.currency} | Method: {r.method}
            <button onClick={() => approve(r)}>Approve</button>
            <button onClick={() => reject(r)}>Reject</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
