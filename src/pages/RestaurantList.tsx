// Restaurant List Page - Home Page of CulinaryCompass
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRestaurants, useSearchRestaurants, useFilteredRestaurants, useUniqueCities } from '@/hooks/useRestaurants';
import { RestaurantCard } from '@/components/RestaurantCard';
import { SearchAndFilters } from '@/components/SearchAndFilters';
import { RestaurantGridSkeleton } from '@/components/LoadingSkeletons';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Utensils, ArrowRight } from 'lucide-react';
import heroImage from '@/assets/hero-culinary.jpg';

export const RestaurantList = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSearchQuery, setActiveSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);

  // Data fetching
  const { data: restaurantsData, isLoading, error } = useRestaurants();
  const { data: searchData, isLoading: isSearching } = useSearchRestaurants(activeSearchQuery);

  // Determine which restaurants to show
  const restaurants = activeSearchQuery ? searchData?.restaurants || [] : restaurantsData?.restaurants || [];
  
  // Get unique cities for filter
  const cities = useUniqueCities(restaurantsData?.restaurants || []);

  // Apply client-side filtering and sorting
  const filteredRestaurants = useFilteredRestaurants(restaurants, {
    city: selectedCity,
    minRating,
    sortBy,
    sortOrder: 'desc'
  });

  const handleSearchSubmit = () => {
    setActiveSearchQuery(searchQuery);
  };

  const handleClearFilters = () => {
    setSelectedCity('');
    setMinRating(0);
    setSortBy('');
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
      {/* Hero Section */}
      <div className="relative">
        <div 
          className="h-96 bg-cover bg-center relative"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 bg-gradient-hero/20" />
          
          <div className="relative container mx-auto px-4 h-full flex items-center justify-center">
            <div className="text-center text-white">
              <div className="flex items-center justify-center mb-4">
                <Utensils className="w-12 h-12 text-white mr-3" />
                <h1 className="text-4xl md:text-5xl font-bold">CulinaryCompass</h1>
              </div>
              <p className="text-xl md:text-2xl mb-8 text-white/90">
                Discover amazing restaurants and authentic flavors
              </p>
              <div className="max-w-2xl mx-auto">
                <SearchAndFilters
                  searchQuery={searchQuery}
                  onSearchQueryChange={setSearchQuery}
                  onSearchSubmit={handleSearchSubmit}
                  selectedCity={selectedCity}
                  onCityChange={setSelectedCity}
                  minRating={minRating}
                  onMinRatingChange={setMinRating}
                  sortBy={sortBy}
                  onSortByChange={setSortBy}
                  cities={cities}
                  showFilters={showFilters}
                  onToggleFilters={() => setShowFilters(!showFilters)}
                  onClearFilters={handleClearFilters}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="container mx-auto px-4 py-12">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {activeSearchQuery ? `Search Results for "${activeSearchQuery}"` : 'All Restaurants'}
            </h2>
            <p className="text-muted-foreground">
              {isSearching ? 'Searching...' : `${filteredRestaurants.length} restaurants found`}
            </p>
          </div>
        </div>

        {/* Restaurant Grid */}
        {isSearching ? (
          <RestaurantGridSkeleton />
        ) : filteredRestaurants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map((restaurant) => (
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
              Try adjusting your search criteria or browse all restaurants.
            </p>
            <Button onClick={handleClearFilters} variant="outline">
              Clear Filters
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};