
import { useState } from "react";
import { useNFTStore, SortOption, NFTStatus } from "@/store/nftStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Search, 
  ChevronDown, 
  LayoutGrid, 
  List,
  Clock,
  DollarSign,
  TrendingUp,
  FilterX
} from "lucide-react";

export function NFTFilters() {
  const {
    viewMode,
    setViewMode,
    sortOption,
    setSortOption,
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    collectionFilter,
    setCollectionFilter,
    nfts
  } = useNFTStore();

  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Get unique collections from NFTs
  const collections = Array.from(
    new Set(nfts.map((nft) => nft.collection).filter(Boolean) as string[])
  );

  // Sort options with icons
  const sortOptions: { value: SortOption; label: string; icon: React.ReactNode }[] = [
    { value: "newest", label: "Newest", icon: <Clock className="h-4 w-4" /> },
    { value: "oldest", label: "Oldest", icon: <Clock className="h-4 w-4" /> },
    { value: "price", label: "Price (Low to High)", icon: <DollarSign className="h-4 w-4" /> },
    { value: "trending", label: "Trending", icon: <TrendingUp className="h-4 w-4" /> },
  ];

  // Status filter options
  const statusOptions: { value: NFTStatus; label: string }[] = [
    { value: "listed", label: "For Sale" },
    { value: "owned", label: "Owned" },
    { value: "sold", label: "Sold" },
  ];

  // Clear all filters
  const clearFilters = () => {
    setStatusFilter(null);
    setCollectionFilter(null);
    setSearchQuery("");
  };

  // Determine if any filters are active
  const hasActiveFilters = statusFilter !== null || collectionFilter !== null || searchQuery !== "";

  return (
    <div className="mb-8">
      {/* Desktop filters */}
      <div className="hidden md:block space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex-1 mr-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search NFTs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Status Tabs */}
            <Tabs
              value={statusFilter || "all"}
              onValueChange={(value) => setStatusFilter(value === "all" ? null : value as NFTStatus)}
              className="w-auto"
            >
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                {statusOptions.map((option) => (
                  <TabsTrigger key={option.value} value={option.value}>
                    {option.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            
            {/* Collection Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center">
                  {collectionFilter ? `Collection: ${collectionFilter}` : "Collections"}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => setCollectionFilter(null)}>
                  All Collections
                </DropdownMenuItem>
                {collections.map((collection) => (
                  <DropdownMenuItem 
                    key={collection} 
                    onClick={() => setCollectionFilter(collection)}
                  >
                    {collection}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Sort Options */}
            <Select
              value={sortOption}
              onValueChange={(value) => setSortOption(value as SortOption)}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center">
                      {option.icon}
                      <span className="ml-2">{option.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* View Mode Toggles */}
            <div className="flex bg-muted rounded-md p-1">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setViewMode("grid")}
                title="Grid view"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setViewMode("list")}
                title="List view"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Clear Filters */}
            {hasActiveFilters && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearFilters}
                className="h-8 text-muted-foreground hover:text-foreground"
              >
                <FilterX className="h-4 w-4 mr-1" />
                Clear filters
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile filters toggle */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1 mr-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search NFTs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <Button 
            variant="outline" 
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="whitespace-nowrap ml-2"
          >
            Filters
            <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${showMobileFilters ? "rotate-180" : ""}`} />
          </Button>
        </div>
        
        {showMobileFilters && (
          <div className="space-y-4 p-4 bg-muted/30 rounded-lg mb-4 animate-fade-in">
            <div>
              <Label className="mb-2 block">Status</Label>
              <Select
                value={statusFilter || ""}
                onValueChange={(value) => setStatusFilter(value === "" ? null : value as NFTStatus)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All NFTs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All NFTs</SelectItem>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="mb-2 block">Collection</Label>
              <Select
                value={collectionFilter || ""}
                onValueChange={(value) => setCollectionFilter(value === "" ? null : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Collections" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Collections</SelectItem>
                  {collections.map((collection) => (
                    <SelectItem key={collection} value={collection}>
                      {collection}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="mb-2 block">Sort by</Label>
              <Select
                value={sortOption}
                onValueChange={(value) => setSortOption(value as SortOption)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center">
                        {option.icon}
                        <span className="ml-2">{option.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="mb-2 block">View</Label>
              <div className="flex bg-muted rounded-md p-1">
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="sm"
                  className="h-8 w-full"
                  onClick={() => setViewMode("grid")}
                >
                  <LayoutGrid className="h-4 w-4 mr-1" />
                  Grid
                </Button>
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="sm"
                  className="h-8 w-full"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4 mr-1" />
                  List
                </Button>
              </div>
            </div>
            
            {hasActiveFilters && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearFilters}
                className="w-full"
              >
                <FilterX className="h-4 w-4 mr-1" />
                Clear filters
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
