import { serve } from "https://deno.land/x/sift/mod.ts";
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseKey);

serve(async (req) => {
  const { job_id, client_id } = await req.json();

  // Fetch job
  const { data: job, error: jobErr } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", job_id)
    .single();

  if (jobErr || !job) return new Response("Job not found", { status: 404 });
  if (job.client_id !== client_id) return new Response("Unauthorized", { status: 403 });
  if (job.status === "completed") return new Response("Already completed", { status: 400 });

  // Mark job as completed
  await supabase
    .from("jobs")
    .update({ status: "completed" })
    .eq("id", job_id);

  // Calculate amounts
  const platformFee = job.amount * 0.10; // 10%
  const freelancerAmount = job.amount - platformFee;

  // Add to freelancer wallet
  const { data: wallet } = await supabase
    .from("wallets")
    .select("*")
    .eq("user_id", job.freelancer_id)
    .single();

  if (!wallet) {
    // create wallet if not exist
    await supabase.from("wallets").insert({
      user_id: job.freelancer_id,
      balance: freelancerAmount,
    });
  } else {
    await supabase
      .from("wallets")
      .update({ balance: wallet.balance + freelancerAmount })
      .eq("user_id", job.freelancer_id);
  }

  // Notify freelancer
await fetch(`${Deno.env.get("BASE_URL")}/api/sendNotification`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    user_id: job.freelancer_id,
    type: "payment_received",
    message: `Payment of ${freelancerAmount} added to your wallet for job ${job.id}`
  })
});

// Notify client
await fetch(`${Deno.env.get("BASE_URL")}/api/sendNotification`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    user_id: job.client_id,
    type: "job_completed",
    message: `Your job ${job.id} has been marked completed and payment processed.`
  })
});
  
  // Record transaction
  await supabase.from("wallet_transactions").insert({
    user_id: job.freelancer_id,
    amount: freelancerAmount,
    type: "credit",
    source: "job",
    job_id: job_id,
  });

  return new Response(JSON.stringify({ success: true, paid: freelancerAmount }), {
    headers: { "Content-Type": "application/json" },
  });
});
