import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, X, Info, Check } from "lucide-react";
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
export default function Create() {
  const navigate = useNavigate();
  const {
    isConnected,
    connect
  } = useWeb3();
  const {
    toast
  } = useToast();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [collection, setCollection] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Preview image when file is selected
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);

      // Create preview URL
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result as string);
      };
      fileReader.readAsDataURL(selectedFile);
    }
  };

  // Remove selected file
  const handleRemoveFile = () => {
    setFile(null);
    setPreviewUrl(null);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to create an NFT",
        variant: "destructive"
      });
      return;
    }
    if (!file) {
      toast({
        title: "Missing image",
        description: "Please upload an image for your NFT",
        variant: "destructive"
      });
      return;
    }
    if (!name || !description || !price) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Show confirmation dialog
    setShowConfirmDialog(true);
  };

  // Handle NFT creation after confirmation
  const handleCreateNFT = async () => {
    setShowConfirmDialog(false);
    setIsUploading(true);
    try {
      // Simulate upload progress
      const simulateProgress = () => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += Math.floor(Math.random() * 10) + 1;
          if (progress > 100) progress = 100;
          setUploadProgress(progress);
          if (progress === 100) {
            clearInterval(interval);
            // Simulate processing time after upload completes
            setTimeout(() => {
              // In a real app, this would mint the NFT on the blockchain
              toast({
                title: "NFT Created Successfully",
                description: "Your NFT has been created and listed on the marketplace"
              });
              navigate("/profile");
            }, 1500);
          }
        }, 500);
      };
      simulateProgress();
    } catch (error: any) {
      toast({
        title: "Creation failed",
        description: error.message || "Failed to create NFT",
        variant: "destructive"
      });
      setIsUploading(false);
    }
  };

  // Collections list (in a real app, this would be fetched from the backend)
  const collections = ["Abstract Dimensions", "Digital Landscapes", "Cosmic Series", "Neon Collection", "Create new collection..."];
  return <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 pt-24 pb-16">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.5
      }}>
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Create New Character</h1>
            
            {!isConnected ? <div className="bg-muted/30 rounded-xl p-8 text-center">
                <h2 className="text-xl font-medium mb-4">Connect your wallet</h2>
                <p className="text-muted-foreground mb-6">Connect your wallet to mint a new character NFT</p>
                <Button onClick={connect}>Connect Wallet</Button>
              </div> : <form onSubmit={handleSubmit} className="space-y-8">
                {/* File Upload Section */}
                <div className="space-y-2">
                  <Label>Image Reference
              </Label>
                  
                  {!previewUrl ? <div className="border-2 border-dashed border-muted-foreground/20 rounded-xl p-8 text-center">
                      <Input type="file" id="nft-file" className="hidden" accept="image/*,model/gltf-binary,model/gltf+json" onChange={handleFileChange} />
                      <Label htmlFor="nft-file" className="flex flex-col items-center justify-center cursor-pointer">
                        <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">
                          Drag and drop or browse
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4 max-w-md">
                          Supported formats: JPG, PNG, GIF, SVG, WEBP, WEBM, MP4, GLB, GLTF. Max size: 100 MB.
                        </p>
                        <Button type="button" variant="outline">
                          Choose File
                        </Button>
                      </Label>
                    </div> : <div className="relative rounded-xl overflow-hidden border border-border">
                      <img src={previewUrl} alt="NFT Preview" className="w-full h-[300px] object-cover" />
                      <button type="button" onClick={handleRemoveFile} className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm p-2 rounded-full">
                        <X className="h-5 w-5" />
                      </button>
                    </div>}
                </div>
                
                {/* NFT Details */}
                <div className="grid gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Character Name</Label>
                    <Input id="name" placeholder="Item name" value={name} onChange={e => setName(e.target.value)} required />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" placeholder="Provide a detailed description of your item" rows={4} value={description} onChange={e => setDescription(e.target.value)} required />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="collection">Race</Label>
                      <Select value={collection} onValueChange={setCollection}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select collection" />
                        </SelectTrigger>
                        <SelectContent>
                          {collections.map(col => <SelectItem key={col} value={col}>
                              {col}
                            </SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="price">Price (ETH)</Label>
                      <Input id="price" type="number" step="0.01" min="0" placeholder="0.00" value={price} onChange={e => setPrice(e.target.value)} required />
                    </div>
                  </div>
                </div>
                
                {/* Info Box */}
                
                
                {/* Submit Button */}
                <div className="pt-4">
                  <Button type="submit" size="lg" className="w-full md:w-auto" disabled={isUploading}>
                    {isUploading ? <>
                        <div className="mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        {uploadProgress < 100 ? `Uploading ${uploadProgress}%` : "Processing..."}
                      </> : "Create NFT"}
                  </Button>
                </div>
              </form>}
          </div>
        </motion.div>
      </main>
      
      <footer className="bg-muted/50 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Canvas NFT Gallery. All rights reserved.
        </div>
      </footer>
      
      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Create and list your NFT?</AlertDialogTitle>
            <AlertDialogDescription>
              You're about to create an NFT for "{name}" priced at {price} ETH. This will make your NFT visible on the marketplace.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleCreateNFT}>
              <Check className="mr-2 h-4 w-4" />
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>;
}