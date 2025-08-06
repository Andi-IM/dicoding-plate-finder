// CulinaryCompass React Hooks for Restaurant Data
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { restaurantApi, RestaurantApiError } from '@/services/restaurantApi';
import { PostReviewRequest, Restaurant } from '@/types/restaurant';
import { useToast } from '@/hooks/use-toast';

// Query keys for caching
export const restaurantQueryKeys = {
  all: ['restaurants'] as const,
  lists: () => [...restaurantQueryKeys.all, 'list'] as const,
  list: (filters?: Record<string, any>) => [...restaurantQueryKeys.lists(), { filters }] as const,
  details: () => [...restaurantQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...restaurantQueryKeys.details(), id] as const,
  searches: () => [...restaurantQueryKeys.all, 'search'] as const,
  search: (query: string) => [...restaurantQueryKeys.searches(), query] as const,
};

/**
 * Hook to fetch all restaurants
 */
export const useRestaurants = () => {
  return useQuery({
    queryKey: restaurantQueryKeys.list(),
    queryFn: () => restaurantApi.getRestaurants(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to fetch restaurant details
 */
export const useRestaurantDetail = (id: string) => {
  return useQuery({
    queryKey: restaurantQueryKeys.detail(id),
    queryFn: () => restaurantApi.getRestaurantDetail(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to search restaurants
 */
export const useSearchRestaurants = (query: string) => {
  return useQuery({
    queryKey: restaurantQueryKeys.search(query),
    queryFn: () => restaurantApi.searchRestaurants(query),
    enabled: !!query && query.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes for search results
  });
};

/**
 * Hook to submit restaurant reviews
 */
export const usePostReview = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (reviewData: PostReviewRequest) => restaurantApi.postReview(reviewData),
    onSuccess: (data, variables) => {
      // Invalidate and refetch the restaurant detail to show the new review
      queryClient.invalidateQueries({
        queryKey: restaurantQueryKeys.detail(variables.id),
      });

      toast({
        title: "Review Submitted!",
        description: "Thank you for sharing your experience.",
        variant: "default",
      });
    },
    onError: (error: RestaurantApiError) => {
      toast({
        title: "Failed to Submit Review",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });
};

/**
 * Client-side filtering and sorting utilities
 */
export const useFilteredRestaurants = (
  restaurants: Restaurant[],
  filters: {
    city?: string;
    minRating?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }
) => {
  const { city, minRating, sortBy, sortOrder = 'desc' } = filters;

  const filtered = restaurants.filter((restaurant) => {
    if (city && restaurant.city !== city) return false;
    if (minRating && restaurant.rating < minRating) return false;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (!sortBy || sortBy === '') return 0;

    let comparison = 0;
    if (sortBy === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else if (sortBy === 'rating') {
      comparison = a.rating - b.rating;
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });

  return sorted;
};

/**
 * Hook to get unique cities from restaurants
 */
export const useUniqueCities = (restaurants: Restaurant[]) => {
  const cities = [...new Set(restaurants.map(r => r.city))].sort();
  return cities;
};