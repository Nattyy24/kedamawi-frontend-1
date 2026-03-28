import { serve } from "https://deno.land/x/sift/mod.ts";
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseKey);

serve(async (req) => {
  const { proposal_id, client_id } = await req.json();

  // Fetch proposal
  const { data: proposal, error } = await supabase.from("proposals").select("*").eq("id", proposal_id).single();
  if (error || !proposal) return new Response("Proposal not found", { status: 404 });
  if (proposal.client_id !== client_id) return new Response("Unauthorized", { status: 403 });

  // Update proposal status
  await supabase.from("proposals").update({ status: "accepted" }).eq("id", proposal_id);

  // Reject other proposals
  await supabase.from("proposals").update({ status: "rejected" })
    .eq("job_id", proposal.job_id)
    .neq("id", proposal_id);

  // Assign freelancer to job
  await supabase.from("jobs").update({ assigned_freelancer: proposal.freelancer_id, status: "in_progress" })
    .eq("id", proposal.job_id);

  await fetch(`${Deno.env.get("BASE_URL")}/api/sendNotification`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    user_id: proposal.freelancer_id,
    type: "job_assigned",
    message: `You have been assigned to job: ${proposal.job_id}`
  })
});

  return new Response(JSON.stringify({ success: true, freelancer_id: proposal.freelancer_id }), {
    headers: { "Content-Type": "application/json" },
  });
});
