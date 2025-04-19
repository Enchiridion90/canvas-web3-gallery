
import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { shortenAddress } from "@/contexts/Web3Provider";
import { NFT, useNFTStore } from "@/store/nftStore";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface NFTCardProps {
  nft: NFT;
  className?: string;
}

export function NFTCard({ nft, className }: NFTCardProps) {
  const [isLoading, setIsLoading] = useState(true);
  const { toggleFavorite, favorites } = useNFTStore();
  const isFavorite = favorites.includes(nft.id);

  // Status badge styling
  const statusStyles = {
    listed: "bg-green-500/20 text-green-700 dark:text-green-300",
    owned: "bg-blue-500/20 text-blue-700 dark:text-blue-300",
    sold: "bg-red-500/20 text-red-700 dark:text-red-300",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn("nft-card group", className)}
    >
      <div className="relative overflow-hidden aspect-square">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted animate-pulse">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <Link to={`/nft/${nft.id}`}>
          <img
            src={nft.image}
            alt={nft.name}
            className={cn(
              "w-full h-full object-cover transition-transform duration-300 group-hover:scale-110",
              isLoading ? "opacity-0" : "opacity-100"
            )}
            onLoad={() => setIsLoading(false)}
          />
        </Link>
        
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleFavorite(nft.id);
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-background/80 backdrop-blur-sm text-muted-foreground hover:text-red-500 transition-colors"
        >
          <Heart 
            className={cn(
              "h-5 w-5 transition-colors", 
              isFavorite ? "fill-red-500 text-red-500" : "fill-none"
            )} 
          />
        </button>
        
        <div className="absolute bottom-3 left-3">
          <Badge className={cn("badge", statusStyles[nft.status])}>
            {nft.status.charAt(0).toUpperCase() + nft.status.slice(1)}
          </Badge>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <Link to={`/nft/${nft.id}`} className="hover:underline">
            <h3 className="font-semibold text-lg line-clamp-1">{nft.name}</h3>
          </Link>
          <div className="flex items-center space-x-1 text-muted-foreground">
            <Heart className="h-4 w-4 fill-current" />
            <span className="text-xs">{nft.likes}</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            By <span className="hover:text-primary">{shortenAddress(nft.creator)}</span>
          </div>
          <div className="font-medium text-foreground">
            {nft.price} ETH
          </div>
        </div>
      </div>
    </motion.div>
  );
}
