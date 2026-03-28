import { serve } from "https://deno.land/std@0.170.0/http/server.ts";
import fetch from "node-fetch";

serve(async (req) => {
  const { amount, currency, email, first_name, last_name, job_id } = await req.json();

  // TODO: Replace with PayPal REST API integration
  // Sandbox example: create order
  const approvalUrl = "https://www.sandbox.paypal.com/checkoutnow?token=EXAMPLE";

  return new Response(JSON.stringify({ approvalUrl }), { status: 200 });
});
