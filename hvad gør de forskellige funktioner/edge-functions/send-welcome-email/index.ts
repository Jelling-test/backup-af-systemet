// SEND-WELCOME-EMAIL Edge Function
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PORTAL_URL = "https://jelling.vercel.app";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { booking_id } = await req.json();

    if (!booking_id) {
      return new Response(
        JSON.stringify({ error: "booking_id er påkrævet" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Find customer
    let { data: customer } = await supabase
      .from("regular_customers")
      .select("*")
      .eq("booking_id", booking_id)
      .maybeSingle();

    if (!customer) {
      const result = await supabase
        .from("seasonal_customers")
        .select("*")
        .eq("booking_id", booking_id)
        .maybeSingle();
      customer = result.data;
    }

    if (!customer) {
      return new Response(
        JSON.stringify({ error: "Kunde ikke fundet" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!customer.email) {
      return new Response(
        JSON.stringify({ error: "Ingen email på kunden" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generate magic link if not exists
    let magicToken = customer.magic_token;
    if (!magicToken) {
      const generateResponse = await fetch(`${supabaseUrl}/functions/v1/generate-magic-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${supabaseKey}` },
        body: JSON.stringify({ booking_id })
      });
      const tokenResult = await generateResponse.json();
      magicToken = tokenResult.token;
    }

    const magicLink = `${PORTAL_URL}/m/${booking_id}/${magicToken}`;

    // Send email
    const emailResponse = await fetch(`${supabaseUrl}/functions/v1/send-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${supabaseKey}` },
      body: JSON.stringify({
        to: customer.email,
        subject: "🏕️ Velkommen til Jelling Camping!",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1>Hej ${customer.first_name}!</h1>
            <p>Vi glæder os til at byde dig velkommen på Jelling Camping.</p>
            <p><strong>Ankomst:</strong> ${customer.arrival_date}</p>
            <p><strong>Afrejse:</strong> ${customer.departure_date}</p>
            <p>Du kan bruge dit personlige link til at tilgå din gæsteportal:</p>
            <p><a href="${magicLink}" style="background: #0d9488; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">Åbn Gæsteportal</a></p>
            <p>Her kan du:</p>
            <ul>
              <li>Se og købe strømpakker</li>
              <li>Se events på pladsen</li>
              <li>Bestille morgenmad og bageri</li>
            </ul>
            <p>Vi ses snart!</p>
            <p>Hilsen<br>Jelling Camping</p>
          </div>
        `
      })
    });

    const emailResult = await emailResponse.json();

    // Log email sent
    await supabase.from("email_logs").insert({
      booking_id,
      email: customer.email,
      template_name: "welcome",
      sent_at: new Date().toISOString(),
      success: emailResult.success
    });

    return new Response(
      JSON.stringify({ success: true, booking_id, email: customer.email }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    console.error("Send welcome email error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
