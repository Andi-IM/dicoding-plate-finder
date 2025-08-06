// CulinaryCompass Restaurant API Service
import { 
  ListResponse, 
  DetailResponse, 
  SearchResponse, 
  PostReviewResponse, 
  PostReviewRequest 
} from '@/types/restaurant';

const BASE_URL = 'https://restaurant-api.dicoding.dev';

class RestaurantApiError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'RestaurantApiError';
  }
}

class RestaurantApi {
  private async fetchWithErrorHandling<T>(url: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      const data = await response.json();

      // Handle API-level errors (error: true in response)
      if (data.error) {
        throw new RestaurantApiError(data.message || 'API Error', response.status);
      }

      // Handle HTTP errors
      if (!response.ok) {
        throw new RestaurantApiError(
          `HTTP Error: ${response.status} - ${response.statusText}`,
          response.status
        );
      }

      return data;
    } catch (error) {
      if (error instanceof RestaurantApiError) {
        throw error;
      }
      
      // Handle network errors
      throw new RestaurantApiError(
        error instanceof Error ? error.message : 'Network Error'
      );
    }
  }

  /**
   * Fetch all restaurants
   */
  async getRestaurants(): Promise<ListResponse> {
    return this.fetchWithErrorHandling<ListResponse>(`${BASE_URL}/list`);
  }

  /**
   * Get restaurant details by ID
   */
  async getRestaurantDetail(id: string): Promise<DetailResponse> {
    return this.fetchWithErrorHandling<DetailResponse>(`${BASE_URL}/detail/${id}`);
  }

  /**
   * Search restaurants by query
   */
  async searchRestaurants(query: string): Promise<SearchResponse> {
    const encodedQuery = encodeURIComponent(query);
    return this.fetchWithErrorHandling<SearchResponse>(`${BASE_URL}/search?q=${encodedQuery}`);
  }

  /**
   * Submit a new customer review
   */
  async postReview(reviewData: PostReviewRequest): Promise<PostReviewResponse> {
    return this.fetchWithErrorHandling<PostReviewResponse>(`${BASE_URL}/review`, {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  }
}

// Export singleton instance
export const restaurantApi = new RestaurantApi();
export { RestaurantApiError };