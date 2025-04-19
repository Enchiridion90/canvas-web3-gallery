
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { NFTDetail } from "@/components/NFTDetail";
import { useNFTStore } from "@/store/nftStore";

export default function NFTDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { selectNFT, clearSelectedNFT, fetchNFTs } = useNFTStore();

  useEffect(() => {
    fetchNFTs();
    
    if (id) {
      selectNFT(id);
    }
    
    return () => {
      clearSelectedNFT();
    };
  }, [id, selectNFT, clearSelectedNFT, fetchNFTs]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <NFTDetail />
      </main>
      
      <footer className="bg-muted/50 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Canvas NFT Gallery. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
