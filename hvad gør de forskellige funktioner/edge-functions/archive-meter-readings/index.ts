// ARCHIVE-METER-READINGS Edge Function
// Arkiverer gamle måleraflæsninger
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

    console.log("Starting meter readings archive...");

    // Get readings older than 7 days
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 7);

    const { data: oldReadings, error: fetchError } = await supabase
      .from("meter_readings")
      .select("*")
      .lt("time", cutoffDate.toISOString())
      .limit(1000);

    if (fetchError) throw fetchError;

    if (!oldReadings || oldReadings.length === 0) {
      return new Response(
        JSON.stringify({ success: true, archived: 0, message: "No old readings to archive" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Archive to meter_readings_archive
    const { error: archiveError } = await supabase
      .from("meter_readings_archive")
      .insert(oldReadings);

    if (archiveError) throw archiveError;

    // Delete archived readings
    const ids = oldReadings.map(r => r.id);
    const { error: deleteError } = await supabase
      .from("meter_readings")
      .delete()
      .in("id", ids);

    if (deleteError) throw deleteError;

    console.log(`Archived ${oldReadings.length} meter readings`);

    return new Response(
      JSON.stringify({ success: true, archived: oldReadings.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    console.error("Archive error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
