// ADMIN-BYPASS-METER Edge Function
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
    const { meter_id, state, reason } = await req.json();

    if (!meter_id || !state) {
      return new Response(
        JSON.stringify({ error: "meter_id og state er påkrævet" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const validState = state.toUpperCase();
    console.log(`Admin bypass: ${meter_id} → ${validState} (reason: ${reason || "none"})`);

    // Insert command without package validation
    const { error } = await supabase.from("meter_commands").insert({
      meter_id,
      command: "set_state",
      value: validState,
      status: "pending"
    });

    if (error) throw error;

    // Log admin action
    await supabase.from("plugin_data").insert({
      organization_id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
      module: "admin_logs",
      ref_id: `bypass_${Date.now()}`,
      key: `admin_bypass_${meter_id}`,
      data: {
        meter_id,
        state: validState,
        reason: reason || "Admin bypass",
        timestamp: new Date().toISOString()
      }
    });

    return new Response(
      JSON.stringify({ success: true, meter_id, state: validState }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    console.error("Admin bypass error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
