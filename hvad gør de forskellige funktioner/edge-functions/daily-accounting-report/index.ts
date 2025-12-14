// DAILY-ACCOUNTING-REPORT Edge Function
// Genererer daglig regnskabsrapport
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
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const reportDate = yesterday.toISOString().split("T")[0];

    console.log(`Generating accounting report for ${reportDate}`);

    // Get all payments for the day
    const { data: payments } = await supabase
      .from("plugin_data")
      .select("*")
      .eq("module", "pakker")
      .eq("data->>betalt", "true")
      .gte("created_at", `${reportDate}T00:00:00`)
      .lt("created_at", `${reportDate}T23:59:59`);

    const totalRevenue = (payments || []).reduce((sum, p) => {
      const price = parseFloat(p.data?.pris || "0");
      return sum + price;
    }, 0);

    const report = {
      date: reportDate,
      total_payments: payments?.length || 0,
      total_revenue: totalRevenue,
      generated_at: new Date().toISOString()
    };

    // Save report
    await supabase.from("plugin_data").insert({
      organization_id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
      module: "daily_reports",
      ref_id: `report_${reportDate}`,
      key: `accounting_${reportDate}`,
      data: report
    });

    console.log(`Report generated: ${report.total_payments} payments, ${report.total_revenue} DKK`);

    return new Response(
      JSON.stringify({ success: true, report }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    console.error("Daily report error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
