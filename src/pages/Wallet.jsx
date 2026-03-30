import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function Wallet() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;
    if (!userId) return;

    let { data: wallet } = await supabase
      .from("wallets")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (!wallet) {
      await supabase.from("wallets").insert({ user_id: userId, balance: 0 });
      wallet = { balance: 0 };
    }

    setBalance(wallet.balance);

    const { data } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    setTransactions(data || []);
  }

  async function simulatePayment() {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user.id;

    const amount = 100;
    const net = amount * 0.9;

    const { data: wallet } = await supabase
      .from("wallets")
      .select("*")
      .eq("user_id", userId)
      .single();

    const newBalance = (wallet?.balance || 0) + net;

    await supabase.from("wallets").update({ balance: newBalance }).eq("user_id", userId);

    await supabase.from("transactions").insert({
      user_id: userId,
      amount: net,
      type: "credit",
      description: "Payment received"
    });

    load();
  }

  async function withdraw() {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user.id;

    const { data: wallet } = await supabase
      .from("wallets")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (wallet.balance < 50) {
      alert("Minimum $50 required");
      return;
    }

    await supabase.from("wallets").update({ balance: wallet.balance - 50 }).eq("user_id", userId);

    await supabase.from("transactions").insert({
      user_id: userId,
      amount: 50,
      type: "debit",
      description: "Withdrawal"
    });

    load();
  }

  return (
    <div>
      <h2>Wallet 💰</h2>

      <p>Balance: ${balance}</p>

      <button onClick={simulatePayment}>Simulate Payment</button>
      <button onClick={withdraw}>Withdraw $50</button>

      {transactions.map(t => (
        <div key={t.id}>
          {t.description} - ${t.amount}
        </div>
      ))}
    </div>
  );
}