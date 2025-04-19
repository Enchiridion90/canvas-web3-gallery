
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Image, DollarSign, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { NFTCard } from "@/components/NFTCard";
import { useNFTStore } from "@/store/nftStore";

export default function Index() {
  const { nfts } = useNFTStore();
  
  // Take just the first 4 NFTs for the showcase
  const featuredNfts = nfts.slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-28 pb-16 md:pt-36 md:pb-24">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-1"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Discover, Collect & Sell Digital Art <span className="text-primary">NFTs</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 md:pr-12">
              A revolutionary marketplace for non-fungible tokens. Explore, trade, and 
              showcase your digital art with Canvas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="text-lg">
                <Link to="/explore">
                  Explore Collection
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg">
                <Link to="/create">
                  Create NFT
                </Link>
              </Button>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex-1"
          >
            <div className="grid grid-cols-2 gap-4">
              {featuredNfts.map((nft) => (
                <div key={nft.id} className="aspect-square rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300">
                  <img 
                    src={nft.image} 
                    alt={nft.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="bg-muted/30 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            The Complete NFT Experience
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-card rounded-xl p-6 shadow-card"
            >
              <div className="bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <Image className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Create & Mint</h3>
              <p className="text-muted-foreground">
                Turn your digital creations into NFTs with just a few clicks. Support for multiple file types and metadata.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-card rounded-xl p-6 shadow-card"
            >
              <div className="bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <DollarSign className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Buy & Sell</h3>
              <p className="text-muted-foreground">
                A secure marketplace for trading digital assets with transparent pricing and ownership verification.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-card rounded-xl p-6 shadow-card"
            >
              <div className="bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <Wallet className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Connect & Collect</h3>
              <p className="text-muted-foreground">
                Connect your wallet seamlessly and manage your growing collection of digital art and assets.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Featured NFTs */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Hot Drops</h2>
          <Button asChild variant="ghost" className="flex items-center">
            <Link to="/explore">
              View all
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {nfts.slice(0, 8).map((nft) => (
            <NFTCard key={nft.id} nft={nft} />
          ))}
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your NFT Journey?
          </h2>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of creators and collectors in the digital art revolution.
          </p>
          <Button asChild size="lg" variant="secondary" className="text-lg">
            <Link to="/explore">
              Explore the Gallery
            </Link>
          </Button>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-muted/50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <span className="text-2xl font-bold text-primary">Canvas</span>
              <p className="text-sm text-muted-foreground mt-1">The Next Generation NFT Marketplace</p>
            </div>
            <div className="flex space-x-6">
              <Link to="/" className="text-muted-foreground hover:text-foreground">
                Terms
              </Link>
              <Link to="/" className="text-muted-foreground hover:text-foreground">
                Privacy
              </Link>
              <Link to="/" className="text-muted-foreground hover:text-foreground">
                Contact
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-border/40 text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Canvas NFT Gallery. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
