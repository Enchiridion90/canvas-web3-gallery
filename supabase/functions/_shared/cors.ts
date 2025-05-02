
// Get allowed origins from environment or default to '*'
const allowedOrigins = Deno.env.get('ALLOWED_ORIGIN') || '*';

// Create an array of origins from comma-separated string
const originsList = allowedOrigins === '*' ? ['*'] : allowedOrigins.split(',');

// Generate the appropriate Access-Control-Allow-Origin header value
const originHeader = originsList.includes('*') ? 
  '*' : 
  // This will be evaluated per-request in the edge function
  '*'; // Temporarily set to '*' - should be replaced with dynamic origin check in production

export const corsHeaders = {
  'Access-Control-Allow-Origin': originHeader,
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper function to check if an origin is allowed
export function isOriginAllowed(requestOrigin: string | null): boolean {
  if (!requestOrigin || originsList.includes('*')) {
    return true;
  }
  
  return originsList.includes(requestOrigin);
}

// Function to get appropriate CORS headers based on the request origin
export function getCorsHeaders(requestOrigin: string | null) {
  if (originsList.includes('*')) {
    return corsHeaders;
  }
  
  return {
    ...corsHeaders,
    'Access-Control-Allow-Origin': isOriginAllowed(requestOrigin) ? requestOrigin : '',
  };
}
