
import { useEffect } from "react";
import { motion } from "framer-motion";
import { useNFTStore } from "@/store/nftStore";
import { NFTCard } from "@/components/NFTCard";
import { Skeleton } from "@/components/ui/skeleton";

interface NFTGridProps {
  className?: string;
}

export function NFTGrid({ className }: NFTGridProps) {
  const { filteredNfts, viewMode, isLoading, fetchNFTs } = useNFTStore();

  useEffect(() => {
    fetchNFTs();
  }, [fetchNFTs]);

  // Determine grid columns based on view mode
  const gridClass = viewMode === "grid" 
    ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" 
    : "grid-cols-1 gap-4";

  if (isLoading) {
    return (
      <div className={`grid ${gridClass} ${className}`}>
        {Array(8).fill(0).map((_, index) => (
          <div key={index} className="nft-card">
            <Skeleton className="aspect-square w-full" />
            <div className="p-4 space-y-3">
              <Skeleton className="h-5 w-3/4" />
              <div className="flex justify-between">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (filteredNfts.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center h-60 text-center"
      >
        <h3 className="text-xl font-medium mb-2">No NFTs found</h3>
        <p className="text-muted-foreground">
          Try adjusting your filters or search criteria
        </p>
      </motion.div>
    );
  }

  // Staggered animation for grid items
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className={`grid ${gridClass} ${className}`}
    >
      {filteredNfts.map((nft) => (
        <NFTCard key={nft.id} nft={nft} />
      ))}
    </motion.div>
  );
}
