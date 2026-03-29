import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function Wallet() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchWallet();
    fetchTransactions();
  }, []);

  async function fetchWallet() {
    const {
      data: { session }
    } = await supabase.auth.getSession();

    if (!session) return;

    const { data } = await supabase
      .from("wallets")
      .select("balance")
      .eq("user_id", session.user.id)
      .single();

    if (data) setBalance(data.balance || 0);
  }

  async function fetchTransactions() {
    const {
      data: { session }
    } = await supabase.auth.getSession();

    if (!session) return;

    const { data } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false });

    setTransactions(data || []);
  }

  // 💰 Simulate payment
  async function simulatePayment() {
    const {
      data: { session }
    } = await supabase.auth.getSession();

    if (!session) {
      alert("You are not logged in");
      return;
    }

    const userId = session.user.id;

    const amount = 100;
    const fee = amount * 0.1;
    const net = amount - fee;

    let { data: wallet } = await supabase
      .from("wallets")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (!wallet) {
      const { data: newWallet } = await supabase
        .from("wallets")
        .insert({ user_id: userId, balance: 0 })
        .select()
        .single();

      wallet = newWallet;
    }

    const newBalance = (wallet.balance || 0) + net;

    await supabase
      .from("wallets")
      .update({ balance: newBalance })
      .eq("user_id", userId);

    await supabase.from("transactions").insert({
      user_id: userId,
      amount: net,
      type: "credit",
      description: "Job payment (after 10% fee)"
    });

    fetchWallet();
    fetchTransactions();
  }

  // 💸 Withdraw
  async function withdrawMoney() {
    const {
      data: { session }
    } = await supabase.auth.getSession();

    if (!session) {
      alert("You are not logged in");
      return;
    }

    const userId = session.user.id;
    const withdrawAmount = 50;

    const { data: wallet } = await supabase
      .from("wallets")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (!wallet) {
      alert("Wallet not found");
      return;
    }

    if (wallet.balance < withdrawAmount) {
      alert("Insufficient balance");
      return;
    }

    const newBalance = wallet.balance - withdrawAmount;

    await supabase
      .from("wallets")
      .update({ balance: newBalance })
      .eq("user_id", userId);

    await supabase.from("transactions").insert({
      user_id: userId,
      amount: withdrawAmount,
      type: "debit",
      description: "Withdrawal"
    });

    fetchWallet();
    fetchTransactions();
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Wallet 💰</h2>

      {/* Buttons */}
      <div className="mb-4">
        <button
          onClick={simulatePayment}
          className="bg-green-600 text-white px-4 py-2 mr-2"
        >
          Simulate $100 Payment
        </button>

        <button
          onClick={withdrawMoney}
          className="bg-red-600 text-white px-4 py-2"
        >
          Withdraw $50
        </button>
      </div>

      {/* Balance */}
      <div className="bg-white shadow p-4 rounded mb-6">
        <h3>Balance</h3>
        <p className="text-2xl font-bold">${balance}</p>
      </div>

      {/* Transactions */}
      <div className="bg-white shadow p-4 rounded">
        <h3 className="mb-3 font-bold">Transactions</h3>

        {transactions.length === 0 ? (
          <p>No transactions yet</p>
        ) : (
          transactions.map((t) => (
            <div key={t.id} className="border-b py-2">
              <p>{t.description}</p>
              <p>${t.amount}</p>
              <p>{t.type}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
