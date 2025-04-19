import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { Web3Provider } from "@/contexts/Web3Provider";
import Index from "./pages/Index";
import Explore from "./pages/Explore";
import NFTDetailPage from "./pages/NFTDetailPage";
import Profile from "./pages/Profile";
import Create from "./pages/Create";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <Web3Provider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/nft/:id" element={<NFTDetailPage />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/create" element={<Create />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </Web3Provider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
