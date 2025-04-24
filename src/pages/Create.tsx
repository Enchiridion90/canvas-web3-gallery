
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Upload, X, Info, Check, Loader2, RefreshCw, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useWeb3 } from "@/contexts/Web3Provider";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

// Mock contract address
const NFT_CONTRACT_ADDRESS = "0x1234567890123456789012345678901234567890";
const OPENSEA_BASE_URL = "https://testnets.opensea.io/assets/goerli/";
const ETHERSCAN_BASE_URL = "https://goerli.etherscan.io/tx/";

export default function Create() {
  const navigate = useNavigate();
  const { isConnected, connect, account, signer } = useWeb3();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [race, setRace] = useState("");
  const [gender, setGender] = useState("");
  const [hairColor, setHairColor] = useState("");
  const [skinTone, setSkinTone] = useState("");
  const [additionalTraits, setAdditionalTraits] = useState("");
  
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [mintingStep, setMintingStep] = useState(0);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [tokenId, setTokenId] = useState<string | null>(null);
  const [showMintSuccessDialog, setShowMintSuccessDialog] = useState(false);
  
  const [currentStep, setCurrentStep] = useState<'traits' | 'generate' | 'approve'>('traits');

  // Race options
  const races = ["Human", "Elf", "Dwarf", "Orc", "Fairy", "Dragon-kin", "Android"];
  
  // Gender options
  const genders = ["Male", "Female", "Non-binary"];
  
  // Hair color options
  const hairColors = ["Black", "Brown", "Blonde", "Red", "White", "Blue", "Purple", "Green"];
  
  // Skin tone options
  const skinTones = ["Light", "Medium", "Dark", "Olive", "Pale", "Tan", "Bronze"];

  const generateCharacterImage = async () => {
    if (!validateTraitInputs()) return;
    
    setIsGenerating(true);
    
    try {
      // Combine user inputs with fixed prompt
      const promptTraits = [
        gender,
        `${hairColor} hair`,
        `${skinTone} skin`,
        race,
        additionalTraits
      ].filter(Boolean).join(", ");
      
      const fullPrompt = `portrait of a ${promptTraits}, portrait style, studio ghibli art, high resolution`;
      
      // Mock API call to generate image
      const response = await mockGenerateImage(fullPrompt);
      setGeneratedImageUrl(response.imageUrl);
      setCurrentStep('approve');
      
      toast({
        title: "Character Generated!",
        description: "Your character has been created. You can approve or try again.",
      });
    } catch (error) {
      console.error("Error generating character:", error);
      toast({
        title: "Generation Failed",
        description: "Could not generate your character. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Mock generate image function
  const mockGenerateImage = async (prompt: string): Promise<{ imageUrl: string }> => {
    // In a real app, this would call your backend API
    console.log("Generating image with prompt:", prompt);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Return a placeholder image URL based on traits
    // In production, this would be the URL returned by your AI service
    return {
      imageUrl: `https://source.unsplash.com/random/512x512/?${gender.toLowerCase()},${race.toLowerCase()},portrait`
    };
  };

  // Mock upload metadata function
  const mockUploadMetadata = async (): Promise<{ metadataUrl: string }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In a real app, this would upload to IPFS or your centralized storage
    return {
      metadataUrl: `https://metadata.example.com/${Date.now()}`
    };
  };

  const validateTraitInputs = () => {
    if (!gender || !race || !hairColor || !skinTone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all character traits",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  const validateNftInputs = () => {
    if (!name || !description || !price) {
      toast({
        title: "Missing Information",
        description: "Please fill in name, description and price",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  const handleTryAgain = () => {
    setGeneratedImageUrl(null);
    setCurrentStep('traits');
  };

  const handleApproveImage = () => {
    setCurrentStep('generate');
    if (!validateNftInputs()) {
      return;
    }
    setShowConfirmDialog(true);
  };

  // Handle NFT minting process
  const handleMintNFT = async () => {
    if (!signer) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to mint an NFT",
        variant: "destructive"
      });
      return;
    }
    
    setShowConfirmDialog(false);
    setIsMinting(true);
    
    try {
      // Step 1: Upload metadata
      setMintingStep(1);
      const { metadataUrl } = await mockUploadMetadata();
      
      // Step 2: Mint the NFT
      setMintingStep(2);
      // In a real implementation, this would call your actual smart contract
      const mockTxHash = "0x" + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
      const mockTokenId = Math.floor(Math.random() * 10000).toString();
      
      // Simulate transaction confirmation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setTxHash(mockTxHash);
      setTokenId(mockTokenId);
      setMintingStep(3);
      
      toast({
        title: "NFT Minted Successfully!",
        description: `Your character NFT has been minted.`,
      });
      
      // Show success dialog
      setShowMintSuccessDialog(true);
      
    } catch (error) {
      console.error("Error minting NFT:", error);
      toast({
        title: "Minting Failed",
        description: "Could not mint your NFT. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsMinting(false);
    }
  };

  const renderTraitSelectionForm = () => (
    <div className="grid gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <Select value={gender} onValueChange={setGender}>
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              {genders.map(g => (
                <SelectItem key={g} value={g}>{g}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="race">Race</Label>
          <Select value={race} onValueChange={setRace}>
            <SelectTrigger>
              <SelectValue placeholder="Select race" />
            </SelectTrigger>
            <SelectContent>
              {races.map(r => (
                <SelectItem key={r} value={r}>{r}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="hairColor">Hair Color</Label>
          <Select value={hairColor} onValueChange={setHairColor}>
            <SelectTrigger>
              <SelectValue placeholder="Select hair color" />
            </SelectTrigger>
            <SelectContent>
              {hairColors.map(hc => (
                <SelectItem key={hc} value={hc}>{hc}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="skinTone">Skin Tone</Label>
          <Select value={skinTone} onValueChange={setSkinTone}>
            <SelectTrigger>
              <SelectValue placeholder="Select skin tone" />
            </SelectTrigger>
            <SelectContent>
              {skinTones.map(st => (
                <SelectItem key={st} value={st}>{st}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="additionalTraits">Additional Traits (optional)</Label>
        <Input 
          id="additionalTraits" 
          placeholder="e.g., scar on face, blue eyes, wearing armor" 
          value={additionalTraits} 
          onChange={e => setAdditionalTraits(e.target.value)} 
        />
      </div>
      
      <Button 
        onClick={generateCharacterImage} 
        disabled={isGenerating || !gender || !race || !hairColor || !skinTone}
        className="mt-4"
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating Character...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-4 w-4" />
            Generate Character
          </>
        )}
      </Button>
    </div>
  );

  const renderGenerateForm = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Character Name</Label>
        <Input id="name" placeholder="Item name" value={name} onChange={e => setName(e.target.value)} required />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" placeholder="Provide a detailed description of your character" rows={4} value={description} onChange={e => setDescription(e.target.value)} required />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="price">Price (ETH)</Label>
        <Input id="price" type="number" step="0.01" min="0" placeholder="0.00" value={price} onChange={e => setPrice(e.target.value)} required />
      </div>
    </div>
  );

  const renderApprovalView = () => (
    <>
      {generatedImageUrl && (
        <div className="flex flex-col items-center space-y-6">
          <div className="relative w-full max-w-md rounded-xl overflow-hidden border border-border">
            <img src={generatedImageUrl} alt="Generated Character" className="w-full h-auto object-cover" />
            <div className="absolute top-0 left-0 bg-background/80 backdrop-blur-sm py-1 px-3 rounded-br-lg">
              <p className="text-xs font-medium">Preview</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 w-full max-w-md">
            <Button onClick={handleTryAgain} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
            <Button onClick={handleApproveImage}>
              <Check className="mr-2 h-4 w-4" />
              Approve & Continue
            </Button>
          </div>
        </div>
      )}
    </>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 pt-24 pb-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Create New Character</h1>
            
            {!isConnected ? (
              <div className="bg-muted/30 rounded-xl p-8 text-center">
                <h2 className="text-xl font-medium mb-4">Connect your wallet</h2>
                <p className="text-muted-foreground mb-6">Connect your wallet to mint a new character NFT</p>
                <Button onClick={connect}>Connect Wallet</Button>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Step indicator */}
                <div className="flex items-center justify-center space-x-2 mb-8">
                  <div className={`h-2 w-2 rounded-full ${currentStep === 'traits' ? 'bg-primary' : 'bg-primary/30'}`}></div>
                  <div className={`h-2 w-2 rounded-full ${currentStep === 'approve' ? 'bg-primary' : 'bg-primary/30'}`}></div>
                  <div className={`h-2 w-2 rounded-full ${currentStep === 'generate' ? 'bg-primary' : 'bg-primary/30'}`}></div>
                </div>
                
                {currentStep === 'traits' && (
                  <>
                    <h2 className="text-xl font-semibold mb-4">Define Character Traits</h2>
                    {renderTraitSelectionForm()}
                  </>
                )}
                
                {currentStep === 'approve' && (
                  <>
                    <h2 className="text-xl font-semibold mb-4">Approve Your Character</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        {renderApprovalView()}
                      </div>
                      <div className="space-y-6">
                        {renderGenerateForm()}
                      </div>
                    </div>
                  </>
                )}
                
                {currentStep === 'generate' && (
                  <>
                    <h2 className="text-xl font-semibold mb-4">Generate NFT</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div className="relative w-full max-w-md rounded-xl overflow-hidden border border-border">
                          <img src={generatedImageUrl} alt="Generated Character" className="w-full h-auto object-cover" />
                        </div>
                      </div>
                      <div className="space-y-6">
                        {renderGenerateForm()}
                      </div>
                    </div>
                  </>
                )}
                
                <Alert className="mt-4">
                  <Info className="h-4 w-4" />
                  <AlertTitle>AI Generated Content</AlertTitle>
                  <AlertDescription>
                    Characters are generated using AI based on your trait selections. Results may vary.
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </div>
        </motion.div>
      </main>
      
      <footer className="bg-muted/50 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Canvas NFT Gallery. All rights reserved.
        </div>
      </footer>
      
      {/* Mint Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Create and mint your NFT?</AlertDialogTitle>
            <AlertDialogDescription>
              You're about to mint an NFT for "{name}" priced at {price} ETH. This will create a transaction on the blockchain.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleMintNFT}>
              <Check className="mr-2 h-4 w-4" />
              Mint NFT
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Minting Progress Dialog */}
      <AlertDialog open={isMinting} onOpenChange={() => {}}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Minting your NFT</AlertDialogTitle>
            <AlertDialogDescription>
              <div className="space-y-4 mt-4">
                <div className="flex items-center space-x-3">
                  <div className={`rounded-full p-1 ${mintingStep >= 1 ? 'bg-primary' : 'bg-muted'}`}>
                    {mintingStep >= 1 ? <Check className="h-4 w-4 text-white" /> : <div className="h-4 w-4" />}
                  </div>
                  <p>Uploading image and metadata{mintingStep === 1 && '...'}</p>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className={`rounded-full p-1 ${mintingStep >= 2 ? 'bg-primary' : 'bg-muted'}`}>
                    {mintingStep >= 2 ? <Check className="h-4 w-4 text-white" /> : <div className="h-4 w-4" />}
                  </div>
                  <p>Minting NFT on blockchain{mintingStep === 2 && '...'}</p>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className={`rounded-full p-1 ${mintingStep >= 3 ? 'bg-primary' : 'bg-muted'}`}>
                    {mintingStep >= 3 ? <Check className="h-4 w-4 text-white" /> : <div className="h-4 w-4" />}
                  </div>
                  <p>Finalizing your NFT{mintingStep === 3 && '...'}</p>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Success Dialog */}
      <AlertDialog open={showMintSuccessDialog} onOpenChange={setShowMintSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>NFT Created Successfully!</AlertDialogTitle>
            <AlertDialogDescription>
              <div className="space-y-4 mt-4">
                <p>Your character NFT has been successfully minted on the blockchain.</p>
                
                <div className="bg-muted p-4 rounded-md space-y-2 text-sm">
                  <div>
                    <span className="font-semibold">Transaction Hash:</span>
                    <a 
                      href={`${ETHERSCAN_BASE_URL}${txHash}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="ml-2 text-primary hover:underline truncate"
                    >
                      {txHash?.substring(0, 10)}...{txHash?.substring(txHash.length - 8)}
                    </a>
                  </div>
                  
                  <div>
                    <span className="font-semibold">View on OpenSea:</span>
                    <a 
                      href={`${OPENSEA_BASE_URL}${NFT_CONTRACT_ADDRESS}/${tokenId}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="ml-2 text-primary hover:underline"
                    >
                      {name}
                    </a>
                  </div>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => {
              setShowMintSuccessDialog(false);
              navigate("/profile");
            }}>
              View My Collection
            </AlertDialogAction>
            <AlertDialogCancel onClick={() => {
              setShowMintSuccessDialog(false);
              setName("");
              setDescription("");
              setPrice("");
              setRace("");
              setGender("");
              setHairColor("");
              setSkinTone("");
              setAdditionalTraits("");
              setGeneratedImageUrl(null);
              setCurrentStep('traits');
            }}>
              Create Another
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
