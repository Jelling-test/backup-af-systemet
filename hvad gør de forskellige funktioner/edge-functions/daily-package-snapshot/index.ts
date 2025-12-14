// DAILY-PACKAGE-SNAPSHOT Edge Function
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

Deno.serve(async (req: Request) => {
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const today = new Date().toISOString().split("T")[0];
    console.log(`Creating daily package snapshot for ${today}`);

    // Get all active packages
    const { data: packages } = await supabase
      .from("plugin_data")
      .select("*")
      .eq("module", "pakker")
      .eq("data->>status", "aktiv");

    // Count by type
    const stats = {
      date: today,
      total_active: packages?.length || 0,
      dagspakker: 0,
      tillaeg: 0,
      total_kwh: 0
    };

    for (const pkg of packages || []) {
      stats.total_kwh += parseFloat(pkg.data.enheder || "0");
      if (pkg.data.pakke_kategori === "tillæg") {
        stats.tillaeg++;
      } else {
        stats.dagspakker++;
      }
    }

    // Save snapshot
    await supabase.from("plugin_data").insert({
      organization_id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
      module: "daily_stats",
      ref_id: `stats_${today}`,
      key: `package_snapshot_${today}`,
      data: stats
    });

    console.log(`Snapshot created: ${stats.total_active} active packages`);

    return new Response(
      JSON.stringify({ success: true, stats }),
      { headers: { "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    console.error("Daily package snapshot error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
