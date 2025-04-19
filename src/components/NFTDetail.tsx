
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, ExternalLink, Clock, User, Tag, Share2 } from "lucide-react";
import { useNFTStore } from "@/store/nftStore";
import { useWeb3, shortenAddress } from "@/contexts/Web3Provider";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

export function NFTDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { nfts, toggleFavorite, favorites } = useNFTStore();
  const { account, isConnected, connect } = useWeb3();
  const [isLoading, setIsLoading] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);

  // Find the NFT by ID
  const nft = nfts.find((n) => n.id === id);
  const isFavorite = favorites.includes(id || "");

  useEffect(() => {
    if (!nft) {
      // If NFT not found, redirect to 404 or gallery
      navigate("/explore");
    } else {
      // Simulate image loading
      const img = new Image();
      img.src = nft.image;
      img.onload = () => setIsLoading(false);
    }
  }, [nft, navigate]);

  if (!nft) {
    return null;
  }

  // Handle purchase action
  const handlePurchase = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to continue",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsPurchasing(true);
      
      // In a real app, this would call a smart contract
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      toast({
        title: "Purchase successful!",
        description: `You've purchased ${nft.name} for ${nft.price} ETH`,
      });
      
      // In a real app, we would update the NFT status and owner
    } catch (error: any) {
      toast({
        title: "Purchase failed",
        description: error.message || "An error occurred during purchase",
        variant: "destructive",
      });
    } finally {
      setIsPurchasing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        {/* NFT Image */}
        <div className="relative rounded-2xl overflow-hidden border border-border/40 shadow-lg">
          {isLoading ? (
            <Skeleton className="aspect-square w-full" />
          ) : (
            <img
              src={nft.image}
              alt={nft.name}
              className="w-full h-auto aspect-square object-cover"
            />
          )}
          
          <button
            onClick={() => toggleFavorite(nft.id)}
            className="absolute top-4 right-4 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
          >
            <Heart 
              className={`h-6 w-6 ${isFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} 
            />
          </button>
        </div>
        
        {/* NFT Details */}
        <div className="flex flex-col">
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <Badge className="mb-2">{nft.collection}</Badge>
              <Button variant="ghost" size="icon" title="Share">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
            <h1 className="text-3xl font-bold mb-2">{nft.name}</h1>
            <div className="flex items-center text-muted-foreground mb-4">
              <User className="h-4 w-4 mr-1" />
              <span>Owned by </span>
              <Button variant="link" className="p-0 h-auto font-normal">
                {shortenAddress(nft.owner)}
              </Button>
            </div>
          </div>
          
          <div className="p-4 bg-muted/30 rounded-xl mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-muted-foreground">Current price</span>
              <span className="flex items-center text-muted-foreground">
                <Clock className="h-4 w-4 mr-1" />
                Listed {timeAgo(nft.createdAt)}
              </span>
            </div>
            <div className="flex items-baseline">
              <span className="text-2xl font-bold">{nft.price} ETH</span>
              <span className="text-muted-foreground ml-2">
                (≈ ${(parseFloat(nft.price) * 3500).toLocaleString()})
              </span>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Description</h3>
            <p className="text-muted-foreground">{nft.description}</p>
          </div>
          
          {nft.attributes && nft.attributes.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Properties</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {nft.attributes.map((attr, index) => (
                  <div 
                    key={index} 
                    className="bg-primary/5 border border-primary/10 rounded-lg p-3 text-center"
                  >
                    <div className="text-xs text-primary uppercase font-medium">
                      {attr.trait_type}
                    </div>
                    <div className="font-medium mt-1 text-sm">
                      {attr.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <Separator className="my-6" />
          
          <div className="mt-auto">
            {nft.status === "listed" ? (
              isConnected ? (
                <Button 
                  size="lg" 
                  className="w-full text-lg font-semibold"
                  disabled={isPurchasing}
                  onClick={handlePurchase}
                >
                  {isPurchasing ? (
                    <>
                      <div className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Tag className="h-5 w-5 mr-2" />
                      Buy now for {nft.price} ETH
                    </>
                  )}
                </Button>
              ) : (
                <Button size="lg" className="w-full" onClick={connect}>
                  Connect wallet to purchase
                </Button>
              )
            ) : nft.status === "owned" ? (
              <Button 
                size="lg" 
                className="w-full"
                variant="outline"
              >
                List for sale
              </Button>
            ) : (
              <Button 
                size="lg" 
                className="w-full"
                variant="secondary"
                disabled
              >
                This NFT has been sold
              </Button>
            )}
            
            <div className="mt-4 flex justify-center text-sm text-muted-foreground">
              <ExternalLink className="h-4 w-4 mr-1" />
              <span>View on Etherscan</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Helper function to format time ago
function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  
  return Math.floor(seconds) + " seconds ago";
}
