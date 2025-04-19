
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { NFTGrid } from "@/components/NFTGrid";
import { NFTFilters } from "@/components/NFTFilters";
import { useNFTStore } from "@/store/nftStore";

export default function Explore() {
  const { fetchNFTs, filteredNfts } = useNFTStore();

  useEffect(() => {
    fetchNFTs();
  }, [fetchNFTs]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Explore NFTs</h1>
            <p className="text-muted-foreground text-lg">
              Discover {filteredNfts.length} digital assets across collections
            </p>
          </div>
          
          <NFTFilters />
          
          <NFTGrid />
        </motion.div>
      </main>
      
      <footer className="bg-muted/50 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Canvas NFT Gallery. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
