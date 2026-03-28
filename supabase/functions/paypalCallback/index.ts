import { serve } from "https://deno.land/std@0.170.0/http/server.ts";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

serve(async (req) => {
  const { orderID } = await req.json();

  // TODO: Verify PayPal order with REST API
  const isSuccess = true; // replace with real verification
  const amount = 100; // replace with actual
  const email = "user@example.com"; // replace with actual
  const job_id = 123; // replace with actual

  if (isSuccess) {
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
      .update({ balance: wallet.balance + amount * 0.9 }) // 10% fee
      .eq("user_id", userData.id);

    // Record transaction
    await supabase.from("wallet_transactions").insert({
      user_id: userData.id,
      amount,
      type: "credit",
      source: "paypal",
      job_id,
    });

    // Mark job as paid
    await supabase.from("jobs").update({ status: "paid" }).eq("id", job_id);
  }

  return new Response(JSON.stringify({ success: isSuccess }), { status: 200 });
});
