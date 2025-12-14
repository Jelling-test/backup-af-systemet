// SEND-LOW-POWER-WARNING Edge Function
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

serve(async (req) => {
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { booking_nummer, remaining_kwh, customer_name, email } = await req.json();

    console.log(`Sending low power warning to ${email} for booking ${booking_nummer}`);

    // Send email via send-email function
    const emailResponse = await fetch(`${supabaseUrl}/functions/v1/send-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${supabaseKey}` },
      body: JSON.stringify({
        to: email,
        subject: "⚠️ Lavt strømforbrug - Jelling Camping",
        html: `
          <h2>Hej ${customer_name}</h2>
          <p>Dit strømforbrug er ved at løbe tør.</p>
          <p><strong>Resterende: ${remaining_kwh.toFixed(2)} kWh</strong></p>
          <p>Køb venligst en ny pakke for at fortsætte med at bruge strøm.</p>
          <p>Hilsen<br>Jelling Camping</p>
        `
      })
    });

    return new Response(
      JSON.stringify({ success: true, booking_nummer }),
      { headers: { "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    console.error("Send low power warning error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
