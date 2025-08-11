// Search and Filters Component
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Filter, X } from 'lucide-react';

interface SearchAndFiltersProps {
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  onSearchSubmit: () => void;
  selectedCity: string;
  onCityChange: (city: string) => void;
  minRating: number;
  onMinRatingChange: (rating: number) => void;
  sortBy: string;
  onSortByChange: (sort: string) => void;
  cities: string[];
  showFilters: boolean;
  onToggleFilters: () => void;
  onClearFilters: () => void;
}

export const SearchAndFilters = ({
  searchQuery,
  onSearchQueryChange,
  onSearchSubmit,
  selectedCity,
  onCityChange,
  minRating,
  onMinRatingChange,
  sortBy,
  onSortByChange,
  cities,
  showFilters,
  onToggleFilters,
  onClearFilters
}: SearchAndFiltersProps) => {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchQueryChange(localSearchQuery);
    onSearchSubmit();
  };

  const hasActiveFilters = selectedCity || minRating > 0 || sortBy;

  return (
    <div className="space-y-4">
      {/* Search Bar with Filter Button */}
      <div className="flex gap-3 items-center">
        <form onSubmit={handleSearchSubmit} className="flex-1 relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="text"
              placeholder="Search restaurants, cuisines, or locations..."
              value={localSearchQuery}
              onChange={(e) => setLocalSearchQuery(e.target.value)}
              className="pl-10 pr-4 h-12 text-base bg-white/90 backdrop-blur-sm border-white/30 focus:border-white shadow-sm"
              aria-label="Search restaurants, cuisines, or locations"
            />
          </div>
        </form>
        
        <Button
          variant="outline"
          onClick={onToggleFilters}
          className="flex items-center gap-2 h-12 px-4 bg-white/90 backdrop-blur-sm border-white/30 hover:bg-white text-foreground shadow-sm"
          aria-label="Toggle filters"
        >
          <Filter className="w-4 h-4" />
          Filters
          {hasActiveFilters && (
            <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
              !
            </span>
          )}
        </Button>
      </div>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <div className="flex justify-end">

          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-white/80 hover:text-white hover:bg-white/10 h-10 px-4"
            aria-label="Clear all filters"
          >
            <X className="w-4 h-4 mr-1" />
            Clear Filters
          </Button>
        </div>
      )}

      {/* Filters Panel */}
      {showFilters && (
        <Card className="bg-white/80 backdrop-blur-sm border-primary/20">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* City Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">City</label>
                <Select value={selectedCity} onValueChange={onCityChange}>
                  <SelectTrigger className="h-11" aria-label="Select city">
                    <SelectValue placeholder="All cities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All cities</SelectItem>
                    {cities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Rating Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Minimum Rating</label>
                <Select value={minRating.toString()} onValueChange={(value) => onMinRatingChange(Number(value))}>
                  <SelectTrigger className="h-11" aria-label="Select minimum rating">
                    <SelectValue placeholder="Any rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Any rating</SelectItem>
                    <SelectItem value="3">3+ stars</SelectItem>
                    <SelectItem value="4">4+ stars</SelectItem>
                    <SelectItem value="4.5">4.5+ stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sort Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Sort by</label>
                <Select value={sortBy} onValueChange={onSortByChange}>
                  <SelectTrigger className="h-11" aria-label="Select sort option">
                    <SelectValue placeholder="Default" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Default</SelectItem>
                    <SelectItem value="rating">Rating (High to Low)</SelectItem>
                    <SelectItem value="name">Name (A-Z)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};