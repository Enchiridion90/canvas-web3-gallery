
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { getCorsHeaders } from '../_shared/cors.ts';

// URL for the Sora AI API
const SORA_URL = Deno.env.get('SORA_URL');
const SORA_API_KEY = Deno.env.get('SORA_API_KEY');
// Fallback image URL for development mode
const MOCK_IMAGE_URL = 'https://via.placeholder.com/1024x1024.png?text=Generated+Image';

serve(async (req) => {
  // Get request origin and apply appropriate CORS headers
  const requestOrigin = req.headers.get('origin');
  const headers = getCorsHeaders(requestOrigin);

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers });
  }

  try {
    const { userPrompt } = await req.json();
    
    // Append fixed prompt component
    const fullPrompt = `${userPrompt}, portrait in Studio Ghibli style, 1024x1024`;
    
    let imageUrl = MOCK_IMAGE_URL;
    
    // Call the Sora AI API if API key is configured
    if (SORA_URL && SORA_API_KEY) {
      try {
        console.log("Calling Sora AI API with prompt:", fullPrompt);
        
        const soraRes = await fetch(SORA_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-api-key': SORA_API_KEY },
          body: JSON.stringify({ prompt: fullPrompt })
        });
        
        if (!soraRes.ok) {
          const errorData = await soraRes.json();
          console.error("Sora API error:", errorData);
          throw new Error(`Sora API error: ${errorData.error || soraRes.statusText}`);
        }
        
        const soraData = await soraRes.json();
        imageUrl = soraData.imageUrl;
        
        console.log("Successfully generated image with Sora AI");
      } catch (soraError) {
        console.error("Error calling Sora API:", soraError);
        console.log("Falling back to placeholder image");
        // Fall back to the mock URL
        imageUrl = MOCK_IMAGE_URL;
      }
    } else {
      console.log("Sora API keys not configured, using placeholder image");
    }
    
    return new Response(
      JSON.stringify({ 
        imageUrl,
        fullPrompt 
      }), 
      { 
        headers: { 
          ...headers, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error("Error in generate-image function:", error);
    
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
