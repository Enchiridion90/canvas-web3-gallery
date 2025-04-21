import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { LandPlot, User, Users, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { NFTCard } from "@/components/NFTCard";
import { useNFTStore } from "@/store/nftStore";
export default function Index() {
  const {
    nfts
  } = useNFTStore();
  const featuredNfts = nfts.slice(0, 4);
  return <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-28 pb-16 md:pt-36 md:pb-24">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.5
        }} className="flex-1">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Upgrade Your Game—Trade Rare Digital Assets
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 md:pr-12">
              Welcome to the official marketplace for <span className="text-primary font-semibold">Axion</span> game assets.
              Buy, sell, and collect rare characters, exclusive land, and powerful NPCs—all verified and used in-game.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="text-lg rounded-full">
                <Link to="/explore">
                  Browse Game Assets <ShoppingCart className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg rounded-full">
                <Link to="/create">Create Character</Link>
              </Button>
            </div>
          </motion.div>
          
          <motion.div initial={{
          opacity: 0,
          scale: 0.9
        }} animate={{
          opacity: 1,
          scale: 1
        }} transition={{
          duration: 0.7,
          delay: 0.2
        }} className="flex-1">
            <div className="grid grid-cols-2 gap-4">
              {featuredNfts.map(nft => <div key={nft.id} className="aspect-square rounded-xl overflow-hidden shadow-card hover:shadow-card-hover border-2 border-primary/60 transition-all duration-300">
                  <img src={nft.image} alt={nft.name} className="w-full h-full object-cover" />
                </div>)}
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Game NFT Categories Section */}
      <section className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-violet-900 py-16 md:py-24 text-primary-foreground">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Game Asset Categories
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.5
          }} className="bg-card glass-card rounded-xl p-8 flex flex-col items-center">
              <div className="bg-primary/30 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <User className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Player Characters</h3>
              <p className="text-muted-foreground text-center">Playable in-game characters with unique trait combinations.</p>
            </motion.div>
            
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.5,
            delay: 0.2
          }} className="bg-card glass-card rounded-xl p-8 flex flex-col items-center">
              <div className="bg-primary/30 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <LandPlot className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Land Assets</h3>
              <p className="text-muted-foreground text-center">Buy, sell, or develop exclusive plots of land in the Axion universe.</p>
            </motion.div>
            
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.5,
            delay: 0.4
          }} className="bg-card glass-card rounded-xl p-8 flex flex-col items-center">
              <div className="bg-primary/30 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">NPCs</h3>
              <p className="text-muted-foreground text-center">Unique merchants, workers, and companions to advance your strategy.</p>
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
              View all assets
              <ShoppingCart className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {nfts.slice(0, 8).map(nft => <NFTCard key={nft.id} nft={nft} />)}
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Build Your Legendary Collection
          </h2>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Ready to play? Trade, collect, and own in-game assets that power up your metaverse journey. 
          </p>
          <Button asChild size="lg" variant="secondary" className="text-lg rounded-full">
            <Link to="/explore">
              Browse All Game NFTs
            </Link>
          </Button>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-muted/50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <span className="text-2xl font-bold text-primary">Axion Market</span>
              <p className="text-sm text-muted-foreground mt-1">The Only Official Marketplace for Axion Game Assets</p>
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
            &copy; {new Date().getFullYear()} Axion Marketplace. All rights reserved.
          </div>
        </div>
      </footer>
    </div>;
}