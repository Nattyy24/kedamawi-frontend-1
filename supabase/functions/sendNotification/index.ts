import { serve } from "https://deno.land/x/sift/mod.ts";
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseKey);

serve(async (req) => {
  const { user_id, type, message } = await req.json();

  const { error } = await supabase.from("notifications").insert({ user_id, type, message });
  if (error) return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });

  return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
});
