
import { create } from "zustand";

export type NFTStatus = "listed" | "owned" | "sold";
export type SortOption = "price" | "newest" | "oldest" | "trending";
export type ViewMode = "grid" | "list";

export interface NFT {
  id: string;
  name: string;
  description: string;
  image: string;
  owner: string;
  creator: string;
  price: string;
  likes: number;
  status: NFTStatus;
  createdAt: string;
  collection?: string;
  attributes?: {
    trait_type: string;
    value: string;
  }[];
}

interface NFTState {
  nfts: NFT[];
  favorites: string[];
  filteredNfts: NFT[];
  selectedNFT: NFT | null;
  viewMode: ViewMode;
  sortOption: SortOption;
  statusFilter: NFTStatus | null;
  searchQuery: string;
  collectionFilter: string | null;
  isLoading: boolean;
  // Actions
  setNFTs: (nfts: NFT[]) => void;
  selectNFT: (id: string) => boolean;
  clearSelectedNFT: () => void;
  setSortOption: (option: SortOption) => void;
  setViewMode: (mode: ViewMode) => void;
  setStatusFilter: (status: NFTStatus | null) => void;
  setSearchQuery: (query: string) => void;
  setCollectionFilter: (collection: string | null) => void;
  toggleFavorite: (id: string) => void;
  setLoading: (isLoading: boolean) => void;
  fetchNFTs: () => Promise<void>;
}

// Mock NFT data for initial state
const mockNfts: NFT[] = [
  {
    id: "1",
    name: "Abstract Dimension #1",
    description: "A journey through abstract dimensions and vibrant colors.",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=500&h=500&auto=format&fit=crop",
    owner: "0x1234...5678",
    creator: "0xabcd...efgh",
    price: "0.5",
    likes: 18,
    status: "listed",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    collection: "Abstract Dimensions",
    attributes: [
      { trait_type: "Background", value: "Blue" },
      { trait_type: "Style", value: "Abstract" },
    ],
  },
  {
    id: "2",
    name: "Digital Landscape #4",
    description: "Explore this unique digital landscape with futuristic elements.",
    image: "https://images.unsplash.com/photo-1633108942232-e5d6a412dfca?q=80&w=500&h=500&auto=format&fit=crop",
    owner: "0x2345...6789",
    creator: "0xbcde...fghi",
    price: "0.8",
    likes: 24,
    status: "listed",
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    collection: "Digital Landscapes",
    attributes: [
      { trait_type: "Background", value: "Gradient" },
      { trait_type: "Style", value: "Futuristic" },
    ],
  },
  {
    id: "3",
    name: "Cosmic Voyage",
    description: "A visual journey through the cosmos and beyond.",
    image: "https://images.unsplash.com/photo-1634574740449-130a97f3a9c4?q=80&w=500&h=500&auto=format&fit=crop",
    owner: "0x3456...7890",
    creator: "0xcdef...ghij",
    price: "1.2",
    likes: 36,
    status: "sold",
    createdAt: new Date(Date.now() - 86400000 * 8).toISOString(),
    collection: "Cosmic Series",
    attributes: [
      { trait_type: "Background", value: "Deep Space" },
      { trait_type: "Style", value: "Cosmic" },
    ],
  },
  {
    id: "4",
    name: "Neon Dreams",
    description: "A cyberpunk-inspired artwork with vibrant neon colors.",
    image: "https://images.unsplash.com/photo-1614851099511-536776e506ae?q=80&w=500&h=500&auto=format&fit=crop",
    owner: "0x4567...8901",
    creator: "0xcdef...ghij",
    price: "0.75",
    likes: 45,
    status: "listed",
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    collection: "Neon Collection",
    attributes: [
      { trait_type: "Background", value: "Urban" },
      { trait_type: "Style", value: "Cyberpunk" },
    ],
  },
  {
    id: "5",
    name: "Pixel Paradise",
    description: "A nostalgic pixel art scene reminiscent of early video games.",
    image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=500&h=500&auto=format&fit=crop",
    owner: "0x5678...9012",
    creator: "0xefgh...ijkl",
    price: "0.3",
    likes: 29,
    status: "owned",
    createdAt: new Date(Date.now() - 86400000 * 12).toISOString(),
    collection: "Pixel Art",
    attributes: [
      { trait_type: "Background", value: "Pixel" },
      { trait_type: "Style", value: "Retro" },
    ],
  },
  {
    id: "6",
    name: "Fluid Mechanics",
    description: "An exploration of fluid dynamics and color interactions.",
    image: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?q=80&w=500&h=500&auto=format&fit=crop",
    owner: "0x6789...0123",
    creator: "0xfghi...jklm",
    price: "1.5",
    likes: 52,
    status: "listed",
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    collection: "Fluid Art",
    attributes: [
      { trait_type: "Background", value: "Fluid" },
      { trait_type: "Style", value: "Abstract" },
    ],
  },
  {
    id: "7",
    name: "Geometric Harmony",
    description: "A perfect balance of geometric shapes and harmony.",
    image: "https://images.unsplash.com/photo-1620121692029-d088224ddc74?q=80&w=500&h=500&auto=format&fit=crop",
    owner: "0x7890...1234",
    creator: "0xghij...klmn",
    price: "0.65",
    likes: 31,
    status: "listed",
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    collection: "Geometric Collection",
    attributes: [
      { trait_type: "Background", value: "White" },
      { trait_type: "Style", value: "Geometric" },
    ],
  },
  {
    id: "8",
    name: "Virtual Reality",
    description: "A glimpse into the future of virtual worlds and experiences.",
    image: "https://images.unsplash.com/photo-1617396900799-f4ec2b43c7ae?q=80&w=500&h=500&auto=format&fit=crop",
    owner: "0x8901...2345",
    creator: "0xhijk...lmno",
    price: "2.0",
    likes: 67,
    status: "sold",
    createdAt: new Date(Date.now() - 86400000 * 9).toISOString(),
    collection: "Virtual Worlds",
    attributes: [
      { trait_type: "Background", value: "Digital" },
      { trait_type: "Style", value: "Futuristic" },
    ],
  },
];

export const useNFTStore = create<NFTState>((set, get) => ({
  nfts: mockNfts,
  favorites: [],
  filteredNfts: mockNfts,
  selectedNFT: null,
  viewMode: "grid",
  sortOption: "newest",
  statusFilter: null,
  searchQuery: "",
  collectionFilter: null,
  isLoading: false,

  setNFTs: (nfts) => set({ nfts, filteredNfts: nfts }),

  selectNFT: (id) => {
    const { nfts } = get();
    const selectedNFT = nfts.find((nft) => nft.id === id) || null;
    set({ selectedNFT });
    return selectedNFT !== null; // Return true if NFT was found
  },

  clearSelectedNFT: () => set({ selectedNFT: null }),

  setSortOption: (sortOption) => {
    set({ sortOption });
    const { filteredNfts } = get();
    const sorted = [...filteredNfts];

    switch (sortOption) {
      case "price":
        sorted.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case "newest":
        sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "oldest":
        sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case "trending":
        sorted.sort((a, b) => b.likes - a.likes);
        break;
    }

    set({ filteredNfts: sorted });
  },

  setViewMode: (viewMode) => set({ viewMode }),

  setStatusFilter: (statusFilter) => {
    set({ statusFilter });
    const { nfts, searchQuery, collectionFilter, sortOption } = get();
    
    // Apply all filters
    let filtered = [...nfts];
    
    // Status filter
    if (statusFilter) {
      filtered = filtered.filter((nft) => nft.status === statusFilter);
    }
    
    // Collection filter
    if (collectionFilter) {
      filtered = filtered.filter((nft) => nft.collection === collectionFilter);
    }
    
    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (nft) =>
          nft.name.toLowerCase().includes(query) ||
          nft.description.toLowerCase().includes(query) ||
          nft.collection?.toLowerCase().includes(query)
      );
    }
    
    // Re-apply current sort
    const state = get();
    state.setSortOption(sortOption);
  },

  setSearchQuery: (searchQuery) => {
    set({ searchQuery });
    const { nfts, statusFilter, collectionFilter, sortOption } = get();
    
    // Apply all filters with new search query
    let filtered = [...nfts];
    
    // Status filter
    if (statusFilter) {
      filtered = filtered.filter((nft) => nft.status === statusFilter);
    }
    
    // Collection filter
    if (collectionFilter) {
      filtered = filtered.filter((nft) => nft.collection === collectionFilter);
    }
    
    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (nft) =>
          nft.name.toLowerCase().includes(query) ||
          nft.description.toLowerCase().includes(query) ||
          nft.collection?.toLowerCase().includes(query)
      );
    }
    
    set({ filteredNfts: filtered });
    
    // Re-apply current sort
    const state = get();
    state.setSortOption(sortOption);
  },

  setCollectionFilter: (collectionFilter) => {
    set({ collectionFilter });
    const { nfts, statusFilter, searchQuery, sortOption } = get();
    
    // Apply all filters
    let filtered = [...nfts];
    
    // Status filter
    if (statusFilter) {
      filtered = filtered.filter((nft) => nft.status === statusFilter);
    }
    
    // Collection filter
    if (collectionFilter) {
      filtered = filtered.filter((nft) => nft.collection === collectionFilter);
    }
    
    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (nft) =>
          nft.name.toLowerCase().includes(query) ||
          nft.description.toLowerCase().includes(query) ||
          nft.collection?.toLowerCase().includes(query)
      );
    }
    
    set({ filteredNfts: filtered });
    
    // Re-apply current sort
    const state = get();
    state.setSortOption(sortOption);
  },

  toggleFavorite: (id) => {
    const { favorites } = get();
    const isFavorite = favorites.includes(id);
    
    if (isFavorite) {
      set({ favorites: favorites.filter((favId) => favId !== id) });
    } else {
      set({ favorites: [...favorites, id] });
    }
  },

  setLoading: (isLoading) => set({ isLoading }),

  fetchNFTs: async () => {
    set({ isLoading: true });
    
    try {
      // In a real application, this would be a fetch call to an API or blockchain
      // For now, we'll simulate a delay and return our mock data
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // In a real app, we would fetch NFTs from the blockchain or backend here
      set({ nfts: mockNfts, filteredNfts: mockNfts });
    } catch (error) {
      console.error("Error fetching NFTs:", error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
