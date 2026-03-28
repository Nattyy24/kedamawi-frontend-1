import { useState, useEffect } from "react";
import { detectUserCountry } from "../utils/location";
import { supabase } from "../supabaseClient";

export default function JobPayment({ job, user }) {
  const [loading, setLoading] = useState(false);
  const [currency, setCurrency] = useState("USD");
  const [isLocal, setIsLocal] = useState(false);

  useEffect(() => {
    const detect = async () => {
      const country = await detectUserCountry();
      if (country === "ET") { setCurrency("ETB"); setIsLocal(true); }
    };
    detect();
  }, []);

  const handlePay = async () => {
    setLoading(true);
    try {
      const url = isLocal ? "/api/initChapaPayment" : "/api/initPayPalPayment";
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: job.amount, currency, user, job_id: job.id }),
      });
      const data = await res.json();
      window.location.href = data.data?.checkout_url || data.approvalUrl;
    } catch (err) { console.error(err); alert("Payment failed"); }
    setLoading(false);
  };

  return (
    <div>
      <h2>Pay for Job: {job.title}</h2>
      <p>Amount: {currency} {job.amount}</p>
      <button onClick={handlePay} disabled={loading}>{loading ? "Processing..." : "Pay Now"}</button>
    </div>
  );
}
