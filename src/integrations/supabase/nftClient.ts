
import { supabase } from './client';

// Utility functions for interacting with generations and NFTs tables
export const nftService = {
  async storeGeneration(data: {
    wallet_address: string, 
    user_prompt: string, 
    full_prompt: string, 
    image_url: string
  }) {
    const { data: result, error } = await supabase
      .from('generations')
      .insert(data)
      .select();
    
    if (error) throw error;
    return result?.[0];
  },

  async storeNFT(data: {
    token_id: string,
    owner: string,
    positive_traits: string[],
    negative_traits: string[],
    image_url: string
  }) {
    const { data: result, error } = await supabase
      .from('nfts')
      .insert(data)
      .select();
    
    if (error) throw error;
    return result?.[0];
  },

  async getUserNFTs(address: string) {
    const { data, error } = await supabase
      .from('nfts')
      .select('*')
      .eq('owner', address);
    
    if (error) throw error;
    return data || [];
  },
  
  async generateImage(userPrompt: string) {
    const response = await fetch(`https://xgnaltmjvwyahimumbqt.supabase.co/functions/v1/generate-image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabase.auth.session()?.access_token || ''}`,
      },
      body: JSON.stringify({ userPrompt }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate image');
    }
    
    return response.json();
  },
  
  async getTraitRarityStats() {
    const response = await fetch(`https://xgnaltmjvwyahimumbqt.supabase.co/functions/v1/traits-rarity`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabase.auth.session()?.access_token || ''}`,
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to get trait statistics');
    }
    
    return response.json();
  }
};
