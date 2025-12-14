// CREATE-CHECKOUT Edge Function
// Opretter Stripe checkout session
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { booking_nummer, meter_id, package_name, package_price, package_kwh, package_hours, success_url, cancel_url } = await req.json();

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY")!;
    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    console.log(`Creating checkout for booking ${booking_nummer}, package: ${package_name}`);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{
        price_data: {
          currency: "dkk",
          product_data: {
            name: package_name,
            description: `${package_kwh} kWh strømpakke - ${package_hours} timer`,
          },
          unit_amount: Math.round(package_price * 100),
        },
        quantity: 1,
      }],
      mode: "payment",
      success_url: success_url || `https://jelling.vercel.app/guest/power?success=true`,
      cancel_url: cancel_url || `https://jelling.vercel.app/guest/power?cancelled=true`,
      metadata: {
        booking_nummer: booking_nummer.toString(),
        meter_id: meter_id || "",
        package_name,
        package_kwh: package_kwh.toString(),
        package_hours: package_hours.toString(),
      },
    });

    console.log(`Checkout session created: ${session.id}`);

    return new Response(
      JSON.stringify({ url: session.url, session_id: session.id }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    console.error("Create checkout error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
