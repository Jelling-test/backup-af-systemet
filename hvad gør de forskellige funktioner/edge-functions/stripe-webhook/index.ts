// STRIPE-WEBHOOK Edge Function
// Håndterer Stripe webhook events
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY")!;
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET")!;
    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    const signature = req.headers.get("stripe-signature");
    const body = await req.text();

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature!, webhookSecret);
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err.message);
      return new Response(JSON.stringify({ error: "Invalid signature" }), { status: 400 });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log(`Stripe event: ${event.type}`);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const metadata = session.metadata || {};

      console.log(`Payment completed for booking ${metadata.booking_nummer}`);

      // Create package
      const packageData = {
        booking_nummer: metadata.booking_nummer,
        pakke_navn: metadata.package_name,
        enheder: parseFloat(metadata.package_kwh || "0"),
        varighed_timer: parseInt(metadata.package_hours || "24"),
        status: "aktiv",
        stripe_session_id: session.id,
        betalt: true
      };

      await supabase.from("plugin_data").insert({
        organization_id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
        module: "pakker",
        ref_id: `pkg_${Date.now()}`,
        key: `pakke_${metadata.booking_nummer}_${Date.now()}`,
        data: packageData
      });

      console.log(`Package created for booking ${metadata.booking_nummer}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  } catch (error: any) {
    console.error("Stripe webhook error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
