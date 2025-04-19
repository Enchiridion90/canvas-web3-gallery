
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { ethers } from "ethers";
import { useToast } from "@/hooks/use-toast";

interface Web3ContextType {
  provider: ethers.providers.Web3Provider | null;
  signer: ethers.Signer | null;
  account: string | null;
  chainId: number | null;
  balance: string | null;
  isConnecting: boolean;
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export function Web3Provider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  // Function to connect wallet
  const connect = async () => {
    if (!window.ethereum) {
      toast({
        title: "MetaMask not found",
        description: "Please install MetaMask to use this feature",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsConnecting(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const network = await provider.getNetwork();
      const balance = await provider.getBalance(accounts[0]);

      setProvider(provider);
      setSigner(signer);
      setAccount(accounts[0]);
      setChainId(network.chainId);
      setBalance(ethers.utils.formatEther(balance));
      setIsConnected(true);
      
      localStorage.setItem("isWalletConnected", "true");
      
      toast({
        title: "Wallet connected",
        description: `Connected to ${shortenAddress(accounts[0])}`,
      });
    } catch (error: any) {
      console.error("Error connecting wallet:", error);
      toast({
        title: "Connection failed",
        description: error.message || "Could not connect to wallet",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  // Function to disconnect wallet
  const disconnect = () => {
    setProvider(null);
    setSigner(null);
    setAccount(null);
    setChainId(null);
    setBalance(null);
    setIsConnected(false);
    localStorage.removeItem("isWalletConnected");
    
    toast({
      title: "Wallet disconnected",
      description: "Your wallet has been disconnected",
    });
  };

  // Auto connect if previously connected
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum && localStorage.getItem("isWalletConnected") === "true") {
        try {
          await connect();
        } catch (error) {
          console.error("Auto connect failed:", error);
        }
      }
    };

    checkConnection();
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnect();
        } else if (isConnected) {
          setAccount(accounts[0]);
          updateBalance(accounts[0]);
        }
      };

      const handleChainChanged = () => {
        window.location.reload();
      };

      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);

      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      };
    }
  }, [isConnected]);

  // Helper function to update balance
  const updateBalance = async (address: string) => {
    if (provider) {
      const balance = await provider.getBalance(address);
      setBalance(ethers.utils.formatEther(balance));
    }
  };

  return (
    <Web3Context.Provider
      value={{
        provider,
        signer,
        account,
        chainId,
        balance,
        isConnecting,
        isConnected,
        connect,
        disconnect,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error("useWeb3 must be used within a Web3Provider");
  }
  return context;
}

// Helper function to shorten address
export function shortenAddress(address: string) {
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

// Declare ethereum property on window object
declare global {
  interface Window {
    ethereum: any;
  }
}
