
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/Header";
import { NFTDetail } from "@/components/NFTDetail";
import { useNFTStore } from "@/store/nftStore";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function NFTDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { selectNFT, clearSelectedNFT, fetchNFTs, selectedNFT, isLoading } = useNFTStore();
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const loadNFT = async () => {
      await fetchNFTs();
      
      if (id) {
        const success = selectNFT(id);
        if (!success) {
          setNotFound(true);
        }
      }
    };
    
    loadNFT();
    
    return () => {
      clearSelectedNFT();
    };
  }, [id, selectNFT, clearSelectedNFT, fetchNFTs]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 pt-24 pb-16">
        <Button 
          variant="ghost" 
          className="mb-6 flex items-center"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        {isLoading ? (
          <div className="w-full space-y-6">
            <Skeleton className="h-[400px] w-full rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        ) : notFound ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">NFT Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The NFT you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate('/explore')}>
              Explore Other NFTs
            </Button>
          </div>
        ) : (
          <NFTDetail />
        )}
      </main>
      
      <footer className="bg-muted/50 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Canvas NFT Gallery. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
