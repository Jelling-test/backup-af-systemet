// TOGGLE-POWER Edge Function
// Tænd/sluk strøm for målere
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { meter_id, state, booking_nummer } = await req.json();

    if (!meter_id || !state) {
      return new Response(
        JSON.stringify({ error: "meter_id og state er påkrævet" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Validate state
    const validState = state.toUpperCase();
    if (validState !== "ON" && validState !== "OFF") {
      return new Response(
        JSON.stringify({ error: "state skal være ON eller OFF" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // If turning ON, validate customer has active package
    if (validState === "ON" && booking_nummer) {
      const { data: packages } = await supabase
        .from("plugin_data")
        .select("*")
        .eq("module", "pakker")
        .eq("data->>booking_nummer", booking_nummer.toString())
        .eq("data->>status", "aktiv");

      if (!packages || packages.length === 0) {
        return new Response(
          JSON.stringify({ error: "Ingen aktiv pakke - køb venligst en pakke først" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Insert meter command
    const { error: insertError } = await supabase
      .from("meter_commands")
      .insert({
        meter_id,
        command: "set_state",
        value: validState,
        status: "pending"
      });

    if (insertError) throw insertError;

    console.log(`Power command: ${meter_id} → ${validState}`);

    return new Response(
      JSON.stringify({ success: true, meter_id, state: validState }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    console.error("Toggle power error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
