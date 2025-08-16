// Search Component
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface SearchAndFiltersProps {
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  onSearchSubmit: () => void;
}

export const SearchAndFilters = ({
  searchQuery,
  onSearchQueryChange,
  onSearchSubmit
}: SearchAndFiltersProps) => {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchQueryChange(localSearchQuery);
    onSearchSubmit();
  };

  return (
    <div className="flex gap-3 items-center">
      <form onSubmit={handleSearchSubmit} className="flex-1 relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            type="text"
            placeholder="Search restaurants, cuisines, or locations..."
            value={localSearchQuery}
            onChange={(e) => setLocalSearchQuery(e.target.value)}
            className="pl-10 pr-4 h-11 text-base bg-white/90 backdrop-blur-sm border-white/30 focus:border-white shadow-sm"
            aria-label="Search restaurants, cuisines, or locations"
          />
        </div>
      </form>
      
      <Button
        type="submit"
        onClick={handleSearchSubmit}
        className="h-11 px-6 bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
        aria-label="Search"
      >
        Search
      </Button>
    </div>
  );
};