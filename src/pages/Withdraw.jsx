import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { detectUserCountry } from "../utils/location";

export default function Withdraw({ user }) {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [method, setMethod] = useState("paypal");
  const [walletBalance, setWalletBalance] = useState(0);

  useEffect(() => {
    const fetchWallet = async () => {
      const { data } = await supabase.from("wallets").select("*").eq("user_id", user.id).single();
      if (data) setWalletBalance(data.balance);
    };
    fetchWallet();
  }, [user.id]);

  useEffect(() => {
    const detect = async () => {
      const country = await detectUserCountry();
      if (country === "ET") { setCurrency("ETB"); setMethod("telebirr"); }
    };
    detect();
  }, []);

  const handleWithdraw = async () => {
    const amt = Number(amount);
    if (!amt || amt <= 0) return alert("Enter valid amount");
    if (amt > walletBalance) return alert("Insufficient balance");

    const { error } = await supabase.from("withdraw_requests").insert({ user_id: user.id, amount: amt, currency, method });
    if (error) alert("Withdraw request failed: " + error.message);
    else alert("Withdraw request submitted!");
  };

  return (
    <div>
      <h2>Withdraw Funds</h2>
      <p>Wallet Balance: {walletBalance} {currency}</p>
      <input type="number" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} />
      <select value={method} onChange={e => setMethod(e.target.value)}>
        {currency === "ETB" ? <>
          <option value="telebirr">Telebirr</option>
          <option value="bank">Bank Transfer</option>
        </> : <option value="paypal">PayPal</option>}
      </select>
      <button onClick={handleWithdraw}>Request Withdraw</button>
    </div>
  );
}
