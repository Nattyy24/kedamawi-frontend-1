import { serve } from "https://deno.land/std@0.170.0/http/server.ts";

const CHAPA_INIT_URL = "https://api.chapa.co/v1/transaction/initialize";

serve(async (req) => {
  try {
    const { amount, email, first_name, last_name, job_id } = await req.json();

    const body = {
      amount: amount.toString(),
      currency: "ETB",
      email,
      first_name,
      last_name,
      tx_ref: `kedamawi-${job_id}-${crypto.randomUUID()}`,
      callback_url: `${Deno.env.get("BASE_URL")}/api/chapaCallback`,
      return_url: `${Deno.env.get("BASE_URL")}/payment-success`,
    };

    const chapaRes = await fetch(CHAPA_INIT_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${Deno.env.get("CHAPA_SECRET_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await chapaRes.json();
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response("Error initializing Chapa", { status: 500 });
  }
});
