
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useToast } from '@/hooks/use-toast';
import { useWeb3 } from '@/contexts/Web3Provider';
import { MOCK_NFT_CONTRACT_ABI, MOCK_NFT_CONTRACT_ADDRESS } from '@/constants/mockContractABI';

export interface TraitsEvent {
  tokenId: string;
  owner: string;
  positiveTraits: string[];
  negativeTraits: string[];
}

export function useNFTContract() {
  const { toast } = useToast();
  const { signer, isConnected } = useWeb3();
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastMintedNFT, setLastMintedNFT] = useState<TraitsEvent | null>(null);

  useEffect(() => {
    if (!isConnected || !signer) {
      setContract(null);
      return;
    }

    const nftContract = new ethers.Contract(
      MOCK_NFT_CONTRACT_ADDRESS,
      MOCK_NFT_CONTRACT_ABI,
      signer
    );

    setContract(nftContract);

    // Listen for TraitsAssigned events
    const onTraitsAssigned = (
      tokenId: ethers.BigNumber,
      owner: string,
      positiveTraits: string[],
      negativeTraits: string[]
    ) => {
      const newNFT = {
        tokenId: tokenId.toString(),
        owner,
        positiveTraits,
        negativeTraits,
      };
      setLastMintedNFT(newNFT);
      
      toast({
        title: "NFT Minted Successfully!",
        description: `Token ID: ${tokenId.toString()}`,
      });
    };

    nftContract.on("TraitsAssigned", onTraitsAssigned);

    return () => {
      nftContract.removeListener("TraitsAssigned", onTraitsAssigned);
    };
  }, [signer, isConnected, toast]);

  const mintNFT = async (tokenURI: string) => {
    if (!contract || !isConnected) {
      toast({
        title: "Error",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return null;
    }

    try {
      setIsLoading(true);
      const tx = await contract.mintRequest(tokenURI);
      await tx.wait();
      
      return tx.hash;
    } catch (error: any) {
      console.error("Error minting NFT:", error);
      toast({
        title: "Minting Failed",
        description: error.message || "Could not mint NFT",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    contract,
    mintNFT,
    isLoading,
    lastMintedNFT,
  };
}
