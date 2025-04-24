
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, Calendar, Copy, CheckCheck, Image, Tag, Clock } from "lucide-react";
import { Header } from "@/components/Header";
import { NFTGrid } from "@/components/NFTGrid";
import { useWeb3, shortenAddress } from "@/contexts/Web3Provider";
import { useNFTStore, NFTStatus } from "@/store/nftStore";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export default function Profile() {
  const { account, isConnected, balance, connect } = useWeb3();
  const { nfts, setStatusFilter } = useNFTStore();
  const [activeTab, setActiveTab] = useState<string>("owned");
  const [copied, setCopied] = useState(false);

  // Filter NFTs based on active tab/status AND wallet address
  const filteredNfts = nfts.filter((nft) => {
    // First check if the NFT belongs to the connected wallet
    if (!account || nft.owner.toLowerCase() !== account.toLowerCase()) {
      return false;
    }
    
    // Then apply status filters
    if (activeTab === "owned") return nft.status === "owned";
    if (activeTab === "listed") return nft.status === "listed";
    if (activeTab === "sold") return nft.status === "sold";
    return true;
  });

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setStatusFilter(value === "all" ? null : value as NFTStatus);
  };

  // Copy address to clipboard
  const copyToClipboard = () => {
    if (account) {
      navigator.clipboard.writeText(account);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  useEffect(() => {
    setCopied(false);
  }, [account]);

  if (!isConnected) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-md mx-auto px-4"
          >
            <User className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
            <h1 className="text-3xl font-bold mb-4">Connect your wallet</h1>
            <p className="text-muted-foreground mb-8">
              Connect your wallet to view your NFT collection and manage your assets.
            </p>
            <Button size="lg" onClick={connect}>
              Connect Wallet
            </Button>
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Profile Header */}
          <div className="mb-12">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-10 w-10 text-primary" />
              </div>
              
              <div className="flex-grow">
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-bold">
                    {account ? shortenAddress(account) : "Anonymous User"}
                  </h1>
                  <button
                    onClick={copyToClipboard}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    title="Copy address"
                  >
                    {copied ? (
                      <CheckCheck className="h-5 w-5 text-green-500" />
                    ) : (
                      <Copy className="h-5 w-5" />
                    )}
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Joined April 2023</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Tag className="h-4 w-4 mr-1" />
                    <span>{filteredNfts.length} items</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-muted/30 px-6 py-4 rounded-xl">
                <div className="text-sm text-muted-foreground mb-1">Balance</div>
                <div className="text-xl font-semibold">
                  {balance ? `${parseFloat(balance).toFixed(4)} ETH` : "0.0000 ETH"}
                </div>
              </div>
            </div>
            
            <Separator />
          </div>
          
          {/* NFT Collection Tabs */}
          <Tabs defaultValue="owned" onValueChange={handleTabChange}>
            <div className="flex justify-between items-center mb-8">
              <TabsList>
                <TabsTrigger value="owned">Owned</TabsTrigger>
                <TabsTrigger value="listed">Listed</TabsTrigger>
                <TabsTrigger value="sold">Sold</TabsTrigger>
                <TabsTrigger value="all">All Items</TabsTrigger>
              </TabsList>
              
              <Button variant="outline" size="sm">
                <Image className="h-4 w-4 mr-2" />
                Create NFT
              </Button>
            </div>
            
            <TabsContent value="owned" className="mt-0">
              {filteredNfts.length === 0 ? (
                <EmptyState status="owned" />
              ) : (
                <NFTGrid />
              )}
            </TabsContent>
            
            <TabsContent value="listed" className="mt-0">
              {filteredNfts.length === 0 ? (
                <EmptyState status="listed" />
              ) : (
                <NFTGrid />
              )}
            </TabsContent>
            
            <TabsContent value="sold" className="mt-0">
              {filteredNfts.length === 0 ? (
                <EmptyState status="sold" />
              ) : (
                <NFTGrid />
              )}
            </TabsContent>
            
            <TabsContent value="all" className="mt-0">
              {nfts.length === 0 ? (
                <EmptyState status="all" />
              ) : (
                <NFTGrid />
              )}
            </TabsContent>
          </Tabs>
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

// Empty state component
function EmptyState({ status }: { status: string }) {
  const messages = {
    owned: {
      title: "No owned NFTs",
      description: "You don't own any NFTs yet. Start building your collection!",
      icon: <User className="h-12 w-12 text-muted-foreground mb-4" />,
    },
    listed: {
      title: "No listed NFTs",
      description: "You haven't listed any NFTs for sale yet.",
      icon: <Tag className="h-12 w-12 text-muted-foreground mb-4" />,
    },
    sold: {
      title: "No sold NFTs",
      description: "You haven't sold any NFTs yet.",
      icon: <Clock className="h-12 w-12 text-muted-foreground mb-4" />,
    },
    all: {
      title: "No NFTs found",
      description: "You don't have any NFTs in your collection yet.",
      icon: <Image className="h-12 w-12 text-muted-foreground mb-4" />,
    },
  };

  const message = messages[status as keyof typeof messages] || messages.all;

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {message.icon}
      <h3 className="text-xl font-medium mb-2">{message.title}</h3>
      <p className="text-muted-foreground max-w-md">
        {message.description}
      </p>
      <Button className="mt-6">
        <Image className="h-4 w-4 mr-2" />
        Create NFT
      </Button>
    </div>
  );
}
