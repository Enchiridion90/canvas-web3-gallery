
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from '../_shared/cors.ts';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the Auth context of the logged in user
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Fetch all NFTs
    const { data: nfts, error } = await supabase
      .from('nfts')
      .select('positive_traits, negative_traits');
    
    if (error) throw error;

    // Count trait frequencies
    const positiveCounts: Record<string, number> = {};
    const negativeCounts: Record<string, number> = {};

    // Process each NFT to count trait occurrences
    nfts?.forEach(nft => {
      // Count positive traits
      nft.positive_traits.forEach((trait: string) => {
        positiveCounts[trait] = (positiveCounts[trait] || 0) + 1;
      });
      
      // Count negative traits
      nft.negative_traits.forEach((trait: string) => {
        negativeCounts[trait] = (negativeCounts[trait] || 0) + 1;
      });
    });

    return new Response(
      JSON.stringify({ 
        positive_traits: positiveCounts,
        negative_traits: negativeCounts 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
