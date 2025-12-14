// CHECK-LOW-POWER Edge Function
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

Deno.serve(async (req: Request) => {
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log("Checking for low power customers...");

    // Get all active packages
    const { data: packages } = await supabase
      .from("plugin_data")
      .select("*")
      .eq("module", "pakker")
      .eq("data->>status", "aktiv");

    let warnings_sent = 0;
    const WARNING_THRESHOLD = 2; // kWh

    for (const pkg of packages || []) {
      const bookingNummer = pkg.data.booking_nummer;
      const totalKwh = parseFloat(pkg.data.enheder || "0");

      // Find customer
      let { data: customer } = await supabase
        .from("regular_customers")
        .select("*")
        .eq("booking_id", bookingNummer)
        .maybeSingle();

      if (!customer) {
        const result = await supabase
          .from("seasonal_customers")
          .select("*")
          .eq("booking_id", bookingNummer)
          .maybeSingle();
        customer = result.data;
      }

      if (!customer || !customer.meter_id) continue;

      // Get current meter reading
      const { data: reading } = await supabase
        .from("meter_readings")
        .select("energy")
        .eq("meter_id", customer.meter_id)
        .order("time", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!reading) continue;

      const usedKwh = reading.energy - (customer.meter_start_energy || 0);
      const remainingKwh = totalKwh - usedKwh;

      if (remainingKwh <= WARNING_THRESHOLD && remainingKwh > 0) {
        // Check if warning already sent
        const warningKey = `low_power_${bookingNummer}_${pkg.id}`;
        const { data: existingWarning } = await supabase
          .from("plugin_data")
          .select("id")
          .eq("key", warningKey)
          .maybeSingle();

        if (!existingWarning && customer.email) {
          // Send warning
          await fetch(`${supabaseUrl}/functions/v1/send-low-power-warning`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${supabaseKey}` },
            body: JSON.stringify({
              booking_nummer: bookingNummer,
              remaining_kwh: remainingKwh,
              customer_name: `${customer.first_name} ${customer.last_name}`,
              email: customer.email
            })
          });

          // Mark warning as sent
          await supabase.from("plugin_data").insert({
            organization_id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
            module: "warnings",
            ref_id: warningKey,
            key: warningKey,
            data: { booking_nummer: bookingNummer, sent_at: new Date().toISOString() }
          });

          warnings_sent++;
        }
      }
    }

    return new Response(
      JSON.stringify({ success: true, warnings_sent }),
      { headers: { "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    console.error("Check low power error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
