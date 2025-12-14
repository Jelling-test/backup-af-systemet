import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('📧 Starting bakery daily summary...');

    // Beregn pickup_date (i morgen)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const pickupDate = tomorrow.toISOString().split('T')[0];

    // Hent alle pending ordrer for i morgen
    const { data: orders, error } = await supabase
      .from('bakery_orders')
      .select('*')
      .eq('pickup_date', pickupDate)
      .eq('status', 'pending');

    if (error) throw error;

    if (!orders || orders.length === 0) {
      console.log('No orders - skipping email');
      return new Response(JSON.stringify({
        success: true,
        message: 'No orders for tomorrow',
        orders_count: 0
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Beregn bage-liste
    const bakingList: Record<string, number> = {};
    orders.forEach(order => {
      (order.items || []).forEach((item: any) => {
        if (!bakingList[item.name]) {
          bakingList[item.name] = 0;
        }
        bakingList[item.name] += item.quantity;
      });
    });

    console.log(`✅ Daily summary complete: ${orders.length} orders`);

    return new Response(JSON.stringify({
      success: true,
      message: 'Daily summary generated',
      pickup_date: pickupDate,
      orders_count: orders.length,
      baking_list: bakingList
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Bakery daily summary error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
