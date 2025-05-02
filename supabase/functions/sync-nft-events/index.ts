
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { ethers } from "https://esm.sh/ethers@5.7.2";
import { corsHeaders } from "../_shared/cors.ts";

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_KEY') || '';
const RPC_URL = Deno.env.get('ETHEREUM_RPC_URL') || '';
const CONTRACT_ADDRESS = Deno.env.get('CONTRACT_ADDRESS') || '';

// Mock contract ABI - replace with actual contract ABI
const NFT_CONTRACT_ABI = [
  "event TraitsAssigned(uint256 indexed tokenId, address indexed owner, string[] positiveTraits, string[] negativeTraits)",
];

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log("Starting sync-nft-events function");
    
    // Initialize Supabase client with service role key
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    
    // Initialize ethers provider and contract
    const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, NFT_CONTRACT_ABI, provider);
    
    // Get the last processed block from the database
    const { data: cursorData, error: cursorError } = await supabase
      .from('event_cursor')
      .select('last_block')
      .eq('id', true)
      .single();
    
    if (cursorError) {
      throw new Error(`Failed to retrieve last processed block: ${cursorError.message}`);
    }
    
    const lastProcessedBlock = cursorData?.last_block || 0;
    console.log(`Last processed block: ${lastProcessedBlock}`);
    
    // Get the latest block
    const latestBlock = await provider.getBlockNumber();
    console.log(`Latest block: ${latestBlock}`);
    
    // If we've already processed up to the latest block, nothing to do
    if (lastProcessedBlock >= latestBlock) {
      return new Response(
        JSON.stringify({ 
          message: "No new blocks to process",
          lastProcessedBlock,
          latestBlock
        }), 
        { 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      );
    }
    
    // Query for TraitsAssigned events from last processed block + 1 to latest block
    const filter = contract.filters.TraitsAssigned();
    const events = await contract.queryFilter(
      filter, 
      lastProcessedBlock + 1,
      latestBlock
    );
    
    console.log(`Found ${events.length} TraitsAssigned events`);
    
    // Process each event
    for (const event of events) {
      const { args } = event;
      if (!args) continue;
      
      const [tokenId, owner, positiveTraits, negativeTraits] = args;
      
      // Upsert the NFT into the database
      const { error: upsertError } = await supabase
        .from('nfts')
        .upsert({
          token_id: tokenId.toString(),
          owner: owner.toLowerCase(),
          positive_traits: positiveTraits,
          negative_traits: negativeTraits,
          image_url: `https://placeholders.ai/art/nft/${tokenId}` // Placeholder image URL
        }, {
          onConflict: 'token_id'
        });
      
      if (upsertError) {
        console.error(`Error upserting NFT with token ID ${tokenId}: ${upsertError.message}`);
      } else {
        console.log(`Upserted NFT with token ID ${tokenId}`);
      }
    }
    
    // Update the last processed block in the database
    const { error: updateError } = await supabase
      .from('event_cursor')
      .update({ last_block: latestBlock })
      .eq('id', true);
    
    if (updateError) {
      throw new Error(`Failed to update last processed block: ${updateError.message}`);
    }
    
    return new Response(
      JSON.stringify({ 
        success: true,
        message: `Processed ${events.length} TraitsAssigned events`,
        blocksProcessed: latestBlock - lastProcessedBlock,
        lastProcessedBlock: latestBlock
      }), 
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error("Error processing NFT events:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }), 
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
