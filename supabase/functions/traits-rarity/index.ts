
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getCorsHeaders } from '../_shared/cors.ts';

serve(async (req) => {
  // Get request origin and apply appropriate CORS headers
  const requestOrigin = req.headers.get('origin');
  const headers = getCorsHeaders(requestOrigin);

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers });
  }

  try {
    // Create a Supabase client with the Auth context of the logged in user
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Use the authorization header from the request
    const authHeader = req.headers.get('Authorization');
    if (authHeader) {
      supabase.auth.setSession({
        access_token: authHeader.replace('Bearer ', ''),
        refresh_token: '',
      });
    }
    
    console.log("Calling get_trait_counts RPC function");
    
    // Call the database function to get trait counts
    const { data, error } = await supabase.rpc('get_trait_counts');
    
    if (error) {
      throw error;
    }

    return new Response(
      JSON.stringify(data), 
      { 
        headers: { 
          ...headers, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error("Error in traits-rarity function:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { 
          ...headers, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
