// GET-LIVE-DATA Edge Function
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
    const meter_id = url.searchParams.get("meter_id");

    if (!meter_id) {
      return new Response(
        JSON.stringify({ error: "meter_id er påkrævet" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get latest reading
    const { data: reading, error } = await supabase
      .from("meter_readings")
      .select("*")
      .eq("meter_id", meter_id)
      .order("time", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;

    if (!reading) {
      return new Response(
        JSON.stringify({ error: "Ingen data fundet", meter_id }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        meter_id,
        data: {
          state: reading.state,
          energy: reading.energy,
          power: reading.power,
          voltage: reading.voltage,
          current: reading.current,
          time: reading.time
        }
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    console.error("Get live data error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
