// Restaurant List Page - Home Page of CulinaryCompass
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRestaurants, useSearchRestaurants } from '@/hooks/useRestaurants';
import { RestaurantCard } from '@/components/RestaurantCard';
import { SearchAndFilters } from '@/components/SearchAndFilters';
import { RestaurantGridSkeleton } from '@/components/LoadingSkeletons';
import { MobileNavigation } from '@/components/MobileNavigation';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Utensils, ArrowRight } from 'lucide-react';
import heroImage from '@/assets/hero-culinary.jpg';

export const RestaurantList = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSearchQuery, setActiveSearchQuery] = useState('');
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  // Data fetching
  const { data: restaurantsData, isLoading, error } = useRestaurants();
  const { data: searchData, isLoading: isSearching } = useSearchRestaurants(activeSearchQuery);

  // Determine which restaurants to show
  const restaurants = activeSearchQuery ? searchData?.restaurants || [] : restaurantsData?.restaurants || [];

  const handleSearchSubmit = () => {
    setActiveSearchQuery(searchQuery);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setActiveSearchQuery('');
  };

  const handleRestaurantClick = (restaurantId: string) => {
    navigate(`/restaurant/${restaurantId}`);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-8">
            <div className="text-center">
              <div className="h-8 w-64 bg-gray-200 animate-pulse rounded mx-auto mb-4"></div>
              <div className="h-4 w-96 bg-gray-200 animate-pulse rounded mx-auto"></div>
            </div>
            <RestaurantGridSkeleton />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="container mx-auto px-4">
          <Alert className="max-w-md mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load restaurants. Please try again later.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Mobile Navigation */}
      <MobileNavigation onSearchToggle={() => setShowMobileSearch(!showMobileSearch)} />
      
      <div className="pt-16 lg:pt-0">{/* Offset for mobile nav */}
      {/* Hero Section */}
      <div className="relative">
        <div 
          className="h-64 md:h-80 lg:h-96 bg-cover bg-center relative"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 bg-gradient-hero/20" />
          
          <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-center">
            <div className="text-center text-white">
              <div className="flex items-center justify-center mb-4">
                <Utensils className="w-8 md:w-12 h-8 md:h-12 text-white mr-3" />
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight">CulinaryCompass</h1>
              </div>
              <p className="text-lg md:text-xl lg:text-2xl mb-6 md:mb-8 text-white/90 leading-relaxed">
                Discover amazing restaurants and authentic flavors
              </p>
              <div className="max-w-2xl mx-auto hidden lg:block">
                <SearchAndFilters
                  searchQuery={searchQuery}
                  onSearchQueryChange={setSearchQuery}
                  onSearchSubmit={handleSearchSubmit}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search Section */}
      {showMobileSearch && (
        <div className="lg:hidden bg-background border-b border-border p-4">
          <div className="container mx-auto">
            <SearchAndFilters
              searchQuery={searchQuery}
              onSearchQueryChange={setSearchQuery}
              onSearchSubmit={handleSearchSubmit}
            />
          </div>
        </div>
      )}

      {/* Results Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {activeSearchQuery ? `Search Results for "${activeSearchQuery}"` : 'All Restaurants'}
            </h2>
            <p className="text-muted-foreground">
              {isSearching ? 'Searching...' : `${restaurants.length} restaurants found`}
            </p>
          </div>
        </div>

        {/* Restaurant Grid */}
        {isSearching ? (
          <RestaurantGridSkeleton />
        ) : restaurants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                onClick={() => handleRestaurantClick(restaurant.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Utensils className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No restaurants found</h3>
            <p className="text-muted-foreground mb-6">
              Try a different search or browse all restaurants.
            </p>
            <Button onClick={handleClearSearch} variant="outline" className="h-11 px-6">
              Clear Search
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
      </div> {/* Close pt-16 wrapper */}
    </div>
  );
};