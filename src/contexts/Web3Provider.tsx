
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

  // Check if Web3 provider is available
  const checkWeb3Provider = () => {
    if (typeof window === 'undefined') return false;
    if (!window.ethereum) {
      console.warn('No Web3 provider detected');
      return false;
    }
    return true;
  };

  // Function to connect wallet with enhanced error handling
  const connect = async () => {
    if (!checkWeb3Provider()) {
      toast({
        title: "Web3 Provider Not Found",
        description: "Please install MetaMask or another Web3 wallet to continue",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsConnecting(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
      
      // Request account access
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const account = await signer.getAddress();
      
      // Get network info
      const network = await provider.getNetwork();
      const balance = await provider.getBalance(account);

      // Update state with retrieved data
      setProvider(provider);
      setSigner(signer);
      setAccount(account);
      setChainId(network.chainId);
      setBalance(ethers.utils.formatEther(balance));
      setIsConnected(true);
      
      localStorage.setItem("isWalletConnected", "true");
      
      toast({
        title: "Wallet Connected",
        description: `Connected to ${shortenAddress(account)}`,
      });

      // Set up listeners for network changes
      provider.on("network", (newNetwork, oldNetwork) => {
        if (oldNetwork) {
          window.location.reload();
        }
      });

    } catch (error: any) {
      console.error("Error connecting wallet:", error);
      let errorMessage = "Could not connect to wallet";
      
      if (error.code === 4001) {
        errorMessage = "User rejected connection request";
      } else if (error.code === -32002) {
        errorMessage = "Connection request already pending";
      }
      
      toast({
        title: "Connection Failed",
        description: errorMessage,
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
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    });
  };

  // Auto connect if previously connected
  useEffect(() => {
    const autoConnect = async () => {
      if (checkWeb3Provider() && localStorage.getItem("isWalletConnected") === "true") {
        try {
          await connect();
        } catch (error) {
          console.error("Auto connect failed:", error);
          localStorage.removeItem("isWalletConnected");
        }
      }
    };

    autoConnect();
  }, []);

  // Listen for account and chain changes
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = async (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnect();
        } else if (isConnected) {
          const newAccount = accounts[0];
          setAccount(newAccount);
          try {
            if (provider) {
              const balance = await provider.getBalance(newAccount);
              setBalance(ethers.utils.formatEther(balance));
            }
          } catch (error) {
            console.error("Error updating balance:", error);
          }
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
  }, [isConnected, provider]);

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
