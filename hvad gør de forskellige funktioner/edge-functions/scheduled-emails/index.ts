// SCHEDULED-EMAILS Edge Function
// Sender planlagte emails (f.eks. påmindelser om ankomst)
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log("Processing scheduled emails...");

    // Find ankomster i morgen
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split("T")[0];

    const { data: arrivingCustomers, error } = await supabase
      .from("regular_customers")
      .select("*")
      .eq("arrival_date", tomorrowStr)
      .eq("checked_in", false);

    if (error) throw error;

    let emailsSent = 0;

    for (const customer of arrivingCustomers || []) {
      if (!customer.email) continue;

      // Tjek om email allerede er sendt
      const { data: existingLog } = await supabase
        .from("email_logs")
        .select("id")
        .eq("booking_id", customer.booking_id)
        .eq("template_name", "arrival_reminder")
        .maybeSingle();

      if (existingLog) continue;

      // Send påmindelse
      await fetch(`${supabaseUrl}/functions/v1/send-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${supabaseKey}` },
        body: JSON.stringify({
          to: customer.email,
          subject: "🏕️ I morgen ankommer du til Jelling Camping!",
          html: `
            <h2>Hej ${customer.first_name}!</h2>
            <p>Vi glæder os til at se dig i morgen!</p>
            <p><strong>Ankomstdato:</strong> ${customer.arrival_date}</p>
            <p>Husk at tjekke din gæsteportal for praktisk information.</p>
            <p>Vi ses!</p>
            <p>Hilsen<br>Jelling Camping</p>
          `
        })
      });

      // Log email
      await supabase.from("email_logs").insert({
        booking_id: customer.booking_id,
        email: customer.email,
        template_name: "arrival_reminder",
        sent_at: new Date().toISOString(),
        success: true
      });

      emailsSent++;
    }

    console.log(`Scheduled emails complete: ${emailsSent} sent`);

    return new Response(
      JSON.stringify({ success: true, emails_sent: emailsSent }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    console.error("Scheduled emails error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
