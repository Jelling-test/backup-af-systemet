// GET-GUEST-PORTAL-DATA Edge Function
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
    const url = new URL(req.url);
    const booking_id = url.searchParams.get("booking_id");

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

    let customerType = "regular";
    if (!customer) {
      const result = await supabase
        .from("seasonal_customers")
        .select("*")
        .eq("booking_id", booking_id)
        .maybeSingle();
      customer = result.data;
      customerType = "seasonal";
    }

    if (!customer) {
      return new Response(
        JSON.stringify({ error: "Kunde ikke fundet" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get active packages
    const { data: packages } = await supabase
      .from("plugin_data")
      .select("*")
      .eq("module", "pakker")
      .eq("data->>booking_nummer", booking_id)
      .eq("data->>status", "aktiv");

    // Get upcoming events
    const today = new Date().toISOString().split("T")[0];
    const { data: events } = await supabase
      .from("camp_events")
      .select("*")
      .eq("is_active", true)
      .gte("event_date", today)
      .order("event_date", { ascending: true })
      .limit(5);

    return new Response(
      JSON.stringify({
        success: true,
        customer: {
          firstName: customer.first_name,
          lastName: customer.last_name,
          email: customer.email,
          phone: customer.phone,
          arrivalDate: customer.arrival_date,
          departureDate: customer.departure_date,
          spotNumber: customer.spot_number,
          meterId: customer.meter_id,
          checkedIn: customer.checked_in,
          customerType
        },
        packages: packages || [],
        events: events || []
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    console.error("Get guest portal data error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
