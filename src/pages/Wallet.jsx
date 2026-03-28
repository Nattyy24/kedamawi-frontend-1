import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function Wallet() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch wallet and transactions
  useEffect(() => {
    const fetchWallet = async () => {
      setLoading(true);

      // 1️⃣ Get current user
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData?.session?.user?.id;

      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        // 2️⃣ Fetch wallet
        const { data: walletData, error: walletError } = await supabase
          .from("wallets")
          .select("*")
          .eq("user_id", userId)
          .single();

        if (walletError) throw walletError;
        setBalance(walletData.balance);

        // 3️⃣ Fetch transactions
        const { data: txData, error: txError } = await supabase
          .from("transactions")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false });

        if (txError) throw txError;
        setTransactions(txData);
      } catch (error) {
        alert("Error fetching wallet: " + error.message);
      }

      setLoading(false);
    };

    fetchWallet();
  }, []);

  // Simulated deposit (for testing)
  const handleDeposit = async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData?.session?.user?.id;

    if (!userId) return;

    try {
      // Update wallet balance (+100 for demo)
      const { data: walletData, error: walletError } = await supabase
        .from("wallets")
        .update({ balance: balance + 100 })
        .eq("user_id", userId)
        .single();

      if (walletError) throw walletError;
      setBalance(walletData.balance);

      // Insert transaction
      await supabase.from("transactions").insert([
        {
          user_id: userId,
          type: "deposit",
          amount: 100,
          description: "Test deposit +$100",
        },
      ]);

      alert("Deposit successful!");
    } catch (error) {
      alert("Error updating wallet: " + error.message);
    }
  };

  if (loading) return <p>Loading wallet...</p>;

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>Wallet 💰</h2>
      <p>Current Balance: ${balance}</p>

      {/* Simulated deposit for testing */}
      <button onClick={handleDeposit} style={{ marginBottom: "20px" }}>
        Simulate Deposit +$100
      </button>

      <h3>Transactions</h3>
      {transactions.length === 0 ? (
        <p>No transactions yet.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Date</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Type</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Amount</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Description</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id}>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {new Date(tx.created_at).toLocaleString()}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {tx.type}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  ${tx.amount}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {tx.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
