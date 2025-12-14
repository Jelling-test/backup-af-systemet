// AXIS-ANPR-WEBHOOK Edge Function
// Håndterer nummerplade-genkendelse fra AXIS kamera
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const payload = await req.json();
    const plateNumber = payload.plate || payload.licensePlate;

    console.log("ANPR webhook received plate:", plateNumber);

    // Log access attempt
    await supabase.schema("access").from("access_log").insert({
      plate_number: plateNumber,
      camera_serial: payload.camera_serial || "ANPR001",
      action: "detected",
      source: "anpr_webhook"
    });

    // Check whitelist
    const { data: whitelistEntry } = await supabase
      .schema("access")
      .from("whitelist")
      .select("*")
      .eq("plate_number", plateNumber.toUpperCase().replace(/[^A-Z0-9]/g, ""))
      .eq("is_active", true)
      .maybeSingle();

    if (!whitelistEntry) {
      return new Response(
        JSON.stringify({ allowed: false, reason: "Not in whitelist" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Open gate - pulse sequence
    const gateUrl = '152.115.191.134:65471';
    
    await fetch(`http://${gateUrl}/axis-cgi/io/port.cgi?action=2%3A%2F`, {
      signal: AbortSignal.timeout(3000)
    });
    
    await delay(700);
    
    await fetch(`http://${gateUrl}/axis-cgi/io/port.cgi?action=2%3A%5C`, {
      signal: AbortSignal.timeout(3000)
    });

    console.log("Gate opened for plate:", plateNumber);

    return new Response(
      JSON.stringify({ allowed: true, plate: plateNumber }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    console.error("ANPR webhook error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
