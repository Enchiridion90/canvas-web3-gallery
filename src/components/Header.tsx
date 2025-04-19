
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X, Moon, Sun, Wallet } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { useWeb3, shortenAddress } from "@/contexts/Web3Provider";

export function Header() {
  const { account, isConnected, connect, disconnect } = useWeb3();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Explore", href: "/explore" },
    { name: "Create", href: "/create" },
    { name: "Profile", href: "/profile" },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/80 border-b border-border/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary">Canvas</span>
            </Link>
          </div>
          
          {/* Desktop navigation */}
          <nav className="hidden md:flex md:space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`relative px-3 py-2 text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.name}
                {isActive(item.href) && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </nav>
          
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            
            {isConnected && account ? (
              <div className="relative group">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2"
                  onClick={disconnect}
                >
                  <div className="btn-connect-indicator" />
                  <span className="hidden sm:inline-block">{shortenAddress(account)}</span>
                  <Wallet className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button 
                size="sm" 
                className="whitespace-nowrap"
                onClick={connect}
              >
                <Wallet className="mr-2 h-4 w-4" />
                <span>Connect Wallet</span>
              </Button>
            )}
            
            {/* Mobile menu button */}
            <button
              className="inline-flex items-center justify-center p-2 rounded-md text-muted-foreground hover:text-foreground md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="md:hidden"
        >
          <div className="space-y-1 px-4 py-3 sm:px-6 bg-background border-b border-border/40">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`block px-3 py-2.5 text-base font-medium rounded-lg ${
                  isActive(item.href)
                    ? "text-primary bg-primary/10"
                    : "text-foreground hover:bg-muted/50"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </header>
  );
}
