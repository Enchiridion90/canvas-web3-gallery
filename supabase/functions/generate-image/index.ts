
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from '../_shared/cors.ts';

// TODO: Replace with actual Sora AI API endpoint
const MOCK_IMAGE_URL = 'https://via.placeholder.com/1024x1024.png?text=Generated+Image';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { userPrompt } = await req.json();
    
    // Append fixed prompt component
    const fullPrompt = `${userPrompt}, portrait in Studio Ghibli style, 1024x1024`;
    
    // TODO: Replace with actual Sora AI API call
    return new Response(
      JSON.stringify({ 
        imageUrl: MOCK_IMAGE_URL,
        fullPrompt 
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
