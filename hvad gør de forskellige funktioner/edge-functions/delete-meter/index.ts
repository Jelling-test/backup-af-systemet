// DELETE-METER Edge Function
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
    const { meter_id } = await req.json();

    if (!meter_id) {
      return new Response(
        JSON.stringify({ error: "meter_id er påkrævet" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log(`Deleting meter: ${meter_id}`);

    // Delete from power_meters
    const { error } = await supabase
      .from("power_meters")
      .delete()
      .eq("meter_number", meter_id);

    if (error) throw error;

    // Also delete meter readings
    await supabase.from("meter_readings").delete().eq("meter_id", meter_id);

    console.log(`Meter ${meter_id} deleted`);

    return new Response(
      JSON.stringify({ success: true, meter_id }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    console.error("Delete meter error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
