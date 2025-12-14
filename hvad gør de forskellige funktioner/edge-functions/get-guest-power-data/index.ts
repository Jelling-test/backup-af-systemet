// GET-GUEST-POWER-DATA Edge Function v16
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    let booking_id: string | null = null;
    
    const url = new URL(req.url);
    booking_id = url.searchParams.get('booking_id') || 
                 url.searchParams.get('bookingId') || 
                 url.searchParams.get('booking_nummer');
    
    if (!booking_id && req.method === 'POST') {
      try {
        const body = await req.json();
        booking_id = body.booking_id?.toString() || 
                     body.bookingId?.toString() || 
                     body.booking_nummer?.toString() || 
                     null;
      } catch {}
    }

    if (!booking_id) {
      return new Response(
        JSON.stringify({ error: 'booking_id er påkrævet' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Find kunde
    let { data: customer } = await supabase
      .from('regular_customers')
      .select('*')
      .eq('booking_id', booking_id)
      .maybeSingle();

    let customerType = 'regular';
    if (!customer) {
      const result = await supabase
        .from('seasonal_customers')
        .select('*')
        .eq('booking_id', booking_id)
        .maybeSingle();
      customer = result.data;
      customerType = 'seasonal';
    }

    if (!customer) {
      return new Response(
        JSON.stringify({ error: 'Kunde ikke fundet' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Hent pakker
    const { data: pakker } = await supabase
      .from('plugin_data')
      .select('*')
      .eq('module', 'pakker')
      .eq('data->>booking_nummer', booking_id.toString())
      .eq('data->>status', 'aktiv')
      .order('created_at', { ascending: true });

    const meters: any[] = [];
    let totalUsedEnheder = 0;
    
    // PRIMÆR MÅLER
    if (customer.meter_id) {
      const { data: reading } = await supabase
        .from('meter_readings')
        .select('state, energy, power, voltage, current, time')
        .eq('meter_id', customer.meter_id)
        .order('time', { ascending: false })
        .limit(1)
        .maybeSingle();

      const currentEnergy = reading?.energy || 0;
      const startEnergy = parseFloat(customer.meter_start_energy || '0');
      const meterUsed = Math.max(0, currentEnergy - startEnergy);
      
      const meterUsedRounded = Math.round(meterUsed * 100) / 100;
      totalUsedEnheder += meterUsedRounded;

      meters.push({
        id: customer.meter_id,
        name: customer.meter_name || customer.meter_id,
        isPrimary: true,
        isPowerOn: reading?.state === 'ON',
        currentEnergy: Math.round(currentEnergy * 100) / 100,
        startEnergy: Math.round(startEnergy * 100) / 100,
        usedEnheder: meterUsedRounded,
        usedKwh: meterUsedRounded,
        currentPower: Math.round((reading?.power || 0) * 10) / 10,
        power: Math.round((reading?.power || 0) * 10) / 10,
        voltage: Math.round(reading?.voltage || 0),
        current: Math.round((reading?.current || 0) * 100) / 100,
        lastUpdate: reading?.time
      });
    }

    totalUsedEnheder = Math.round(totalUsedEnheder * 100) / 100;

    // Beregn pakke totaler
    let totalEnheder = 0;
    const packages = (pakker || []).map(p => {
      const enheder = parseFloat(p.data.enheder || '0');
      totalEnheder += enheder;
      return {
        id: p.id,
        name: p.data.pakke_navn,
        enheder,
        status: p.data.status || 'aktiv',
        type: p.data.pakke_kategori === 'tillæg' ? 'tillaeg' : 'dagspakke',
        createdAt: p.created_at
      };
    });

    const remainingEnheder = Math.round(Math.max(0, totalEnheder - totalUsedEnheder) * 100) / 100;
    
    const hasMeter = meters.length > 0;
    const hasPackage = packages.length > 0;

    return new Response(
      JSON.stringify({
        success: true,
        hasMeter,
        hasPackage,
        meterId: customer.meter_id,
        meters,
        packages,
        powerPackage: hasPackage ? {
          id: packages[0]?.id || '',
          status: 'aktiv',
          name: packages.length > 1 ? `${packages.length} pakker` : packages[0]?.name,
          totalEnheder,
          usedEnheder: totalUsedEnheder,
          remainingEnheder
        } : null,
        summary: {
          totalEnheder,
          totalUsedEnheder,
          remainingEnheder,
          meterCount: meters.length
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Ukendt fejl' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
