
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { nftService } from "@/integrations/supabase/nftClient";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface TraitCount {
  [trait: string]: number;
}

interface TraitStats {
  positive_traits: TraitCount;
  negative_traits: TraitCount;
}

export function TraitStats() {
  const { toast } = useToast();
  
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['trait-stats'],
    queryFn: async () => {
      try {
        const result = await nftService.getTraitRarityStats();
        return result as TraitStats;
      } catch (error: any) {
        toast({
          title: "Error loading trait stats",
          description: error.message,
          variant: "destructive"
        });
        throw error;
      }
    },
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <Spinner size="lg" />
        <p className="text-muted-foreground mt-2">Loading trait statistics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-lg border border-destructive/20 bg-destructive/10 text-destructive">
        <h3 className="text-lg font-medium">Failed to load trait statistics</h3>
        <p className="text-sm">{(error as Error).message}</p>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const positiveTraits = Object.entries(stats.positive_traits || {});
  const negativeTraits = Object.entries(stats.negative_traits || {});

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Positive Traits Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-xl font-semibold flex items-center">
            <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 p-1.5 rounded-full mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </span>
            Positive Traits
          </CardTitle>
        </CardHeader>
        <CardContent>
          {positiveTraits.length === 0 ? (
            <p className="text-muted-foreground text-sm">No positive traits found</p>
          ) : (
            <div className="space-y-2">
              {positiveTraits
                .sort((a, b) => b[1] - a[1]) // Sort by count (descending)
                .map(([trait, count]) => (
                  <div key={trait} className="flex items-center justify-between py-1 border-b border-border/40 last:border-0">
                    <span className="font-medium">{trait}</span>
                    <Badge variant="outline" className="bg-background ml-auto">
                      {count}
                    </Badge>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Negative Traits Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-xl font-semibold flex items-center">
            <span className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 p-1.5 rounded-full mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </span>
            Negative Traits
          </CardTitle>
        </CardHeader>
        <CardContent>
          {negativeTraits.length === 0 ? (
            <p className="text-muted-foreground text-sm">No negative traits found</p>
          ) : (
            <div className="space-y-2">
              {negativeTraits
                .sort((a, b) => b[1] - a[1]) // Sort by count (descending)
                .map(([trait, count]) => (
                  <div key={trait} className="flex items-center justify-between py-1 border-b border-border/40 last:border-0">
                    <span className="font-medium">{trait}</span>
                    <Badge variant="outline" className="bg-background ml-auto">
                      {count}
                    </Badge>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
