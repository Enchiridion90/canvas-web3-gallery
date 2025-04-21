
import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Heart, User, Users } from "lucide-react";
import { shortenAddress } from "@/contexts/Web3Provider";
import { NFT, useNFTStore } from "@/store/nftStore";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface NFTCardProps {
  nft: NFT;
  className?: string;
}

// Category styles
const categoryStyles: Record<string, string> = {
  player: "bg-gradient-to-r from-blue-600/80 via-indigo-500/90 to-violet-600/80 text-white shadow",
  land: "bg-gradient-to-r from-green-600/80 via-lime-400/90 to-teal-400/80 text-white shadow",
  npc: "bg-gradient-to-r from-yellow-600/80 via-amber-400/90 to-orange-500/80 text-white shadow",
};
const categoryIcons: Record<string, React.ReactNode> = {
  player: <User className="h-3.5 w-3.5 mr-1" />,
  land: <MapIcon className="h-3.5 w-3.5 mr-1" />,
  npc: <Users className="h-3.5 w-3.5 mr-1" />,
};

// Custom Map icon component for land category since LandPlot isn't available in lucide-react
const MapIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className="lucide lucide-map"
  >
    <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
    <path d="M9 3v15"/>
    <path d="M15 6v15"/>
  </svg>
);

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
        
        <div className="absolute top-3 left-3 flex items-center">
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${categoryStyles[nft.category] || ""}`}>
            {categoryIcons[nft.category]} 
            {nft.category === "player"
              ? "Player"
              : nft.category === "land"
              ? "Land"
              : "NPC"}
          </span>
        </div>
        
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
