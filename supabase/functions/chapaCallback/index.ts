import { serve } from "https://deno.land/std@0.170.0/http/server.ts";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

serve(async (req) => {
  const { tx_ref, status } = await req.json();

  // Verify transaction with Chapa
  const verify = await fetch(`https://api.chapa.co/v1/transaction/verify/${tx_ref}`, {
    headers: { Authorization: `Bearer ${Deno.env.get("CHAPA_SECRET_KEY")}` },
  });
  const result = await verify.json();

  if (result?.data?.status === "success") {
    const email = result.data.customer_email;
    const amount = Number(result.data.amount);
    const job_id = result.data.tx_ref.split("-")[1]; // extract job id

    // Get user
    const { data: userData } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (!userData) return new Response("User not found", { status: 404 });

    // Update wallet
    const { data: wallet } = await supabase
      .from("wallets")
      .select("*")
      .eq("user_id", userData.id)
      .single();

    await supabase
      .from("wallets")
      .update({ balance: wallet.balance + amount * 0.9 }) // 10% platform fee
      .eq("user_id", userData.id);

    // Record transaction
    await supabase.from("wallet_transactions").insert({
      user_id: userData.id,
      amount,
      type: "credit",
      source: "chapa",
      job_id,
    });

    // Mark job as paid
    await supabase.from("jobs").update({ status: "paid" }).eq("id", job_id);
  }

  return new Response(JSON.stringify(result), { status: 200 });
});
