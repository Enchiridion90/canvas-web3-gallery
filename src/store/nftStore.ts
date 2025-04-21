import { create } from "zustand";

export type NFTCategory = "player" | "land" | "npc"; // Added category types

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
  category: NFTCategory; // Added
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
  selectNFT: (id: string) => void;
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

// Updated mock NFT data with categories (player, land, npc)
const mockNfts: NFT[] = [
  {
    id: "1",
    name: "Commander Vox",
    description: "Legendary player character for the Axion Arena.",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=500&h=500&auto=format&fit=crop",
    owner: "0x1234...5678",
    creator: "0xabcd...efgh",
    price: "7.0",
    likes: 18,
    status: "listed",
    category: "player", // new property
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    collection: "Prime Champions",
    attributes: [
      { trait_type: "Class", value: "Tank" },
      { trait_type: "Faction", value: "Resistance" },
    ],
  },
  {
    id: "2",
    name: "Neon Flats Land Plot",
    description: "Premium land parcel within Neo District, yields rare resources.",
    image: "https://images.unsplash.com/photo-1633108942232-e5d6a412dfca?q=80&w=500&h=500&auto=format&fit=crop",
    owner: "0x2345...6789",
    creator: "0xbcde...fghi",
    price: "12.5",
    likes: 24,
    status: "listed",
    category: "land", // new property
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    collection: "Neo District",
    attributes: [
      { trait_type: "Size", value: "XL" },
      { trait_type: "Yield", value: "Rare Crystals" },
    ],
  },
  {
    id: "3",
    name: "Fixer Glix",
    description: "Tech NPC for your squad. Repairs, upgrades, and customizes gear.",
    image: "https://images.unsplash.com/photo-1634574740449-130a97f3a9c4?q=80&w=500&h=500&auto=format&fit=crop",
    owner: "0x3456...7890",
    creator: "0xcdef...ghij",
    price: "3.3",
    likes: 36,
    status: "sold",
    category: "npc",
    createdAt: new Date(Date.now() - 86400000 * 8).toISOString(),
    collection: "NPC Guild",
    attributes: [
      { trait_type: "Role", value: "Engineer" },
      { trait_type: "Skill", value: "Repair Boost" },
    ],
  },
  {
    id: "4",
    name: "Frostbyte Ranger",
    description: "Epic player character with frost abilities.",
    image: "https://images.unsplash.com/photo-1614851099511-536776e506ae?q=80&w=500&h=500&auto=format&fit=crop",
    owner: "0x4567...8901",
    creator: "0xcdef...ghij",
    price: "5.2",
    likes: 45,
    status: "listed",
    category: "player",
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    collection: "Prime Champions",
    attributes: [
      { trait_type: "Class", value: "Scout" },
      { trait_type: "Faction", value: "Frostbyte" },
    ],
  },
  {
    id: "5",
    name: "Citadel Lot 18-B",
    description: "Central fortress land plot. Major strategic advantage in-game.",
    image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=500&h=500&auto=format&fit=crop",
    owner: "0x5678...9012",
    creator: "0xefgh...ijkl",
    price: "18.3",
    likes: 29,
    status: "owned",
    category: "land",
    createdAt: new Date(Date.now() - 86400000 * 12).toISOString(),
    collection: "Citadel Estates",
    attributes: [
      { trait_type: "Size", value: "Large" },
      { trait_type: "Ownership", value: "Fortress" },
    ],
  },
  {
    id: "6",
    name: "Dockhand Koba",
    description: "NPC that unlocks advanced trading missions.",
    image: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?q=80&w=500&h=500&auto=format&fit=crop",
    owner: "0x6789...0123",
    creator: "0xfghi...jklm",
    price: "2.1",
    likes: 52,
    status: "listed",
    category: "npc",
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    collection: "Dockside NPCs",
    attributes: [
      { trait_type: "Role", value: "Trader" },
      { trait_type: "Skill", value: "Resource Bonus" },
    ],
  },
  {
    id: "7",
    name: "Abstract Dimension #1",
    description: "A journey through abstract dimensions and vibrant colors.",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=500&h=500&auto=format&fit=crop",
    owner: "0x1234...5678",
    creator: "0xabcd...efgh",
    price: "0.5",
    likes: 18,
    status: "listed",
    category: "player",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    collection: "Abstract Dimensions",
    attributes: [
      { trait_type: "Background", value: "Blue" },
      { trait_type: "Style", value: "Abstract" },
    ],
  },
  {
    id: "8",
    name: "Digital Landscape #4",
    description: "Explore this unique digital landscape with futuristic elements.",
    image: "https://images.unsplash.com/photo-1633108942232-e5d6a412dfca?q=80&w=500&h=500&auto=format&fit=crop",
    owner: "0x2345...6789",
    creator: "0xbcde...fghi",
    price: "0.8",
    likes: 24,
    status: "listed",
    category: "land",
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    collection: "Digital Landscapes",
    attributes: [
      { trait_type: "Background", value: "Gradient" },
      { trait_type: "Style", value: "Futuristic" },
    ],
  },
  {
    id: "9",
    name: "Cosmic Voyage",
    description: "A visual journey through the cosmos and beyond.",
    image: "https://images.unsplash.com/photo-1634574740449-130a97f3a9c4?q=80&w=500&h=500&auto=format&fit=crop",
    owner: "0x3456...7890",
    creator: "0xcdef...ghij",
    price: "1.2",
    likes: 36,
    status: "sold",
    category: "npc",
    createdAt: new Date(Date.now() - 86400000 * 8).toISOString(),
    collection: "Cosmic Series",
    attributes: [
      { trait_type: "Background", value: "Deep Space" },
      { trait_type: "Style", value: "Cosmic" },
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
