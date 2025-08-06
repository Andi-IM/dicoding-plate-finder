// CulinaryCompass API Types - Dicoding Restaurant API

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  pictureId: string;
  city: string;
  rating: number;
}

export interface RestaurantDetail {
  id: string;
  name: string;
  description: string;
  pictureId: string;
  city: string;
  address: string;
  rating: number;
  categories: Category[];
  menus: Menus;
  customerReviews: CustomerReview[];
}

export interface Category {
  name: string;
}

export interface Menus {
  foods: MenuItem[];
  drinks: MenuItem[];
}

export interface MenuItem {
  name: string;
}

export interface CustomerReview {
  name: string;
  review: string;
  date: string;
}

export interface ListResponse {
  error: boolean;
  message: string;
  count: number;
  restaurants: Restaurant[];
}

export interface DetailResponse {
  error: boolean;
  message: string;
  restaurant: RestaurantDetail;
}

export interface SearchResponse {
  error: boolean;
  message: string;
  founded: number;
  restaurants: Restaurant[];
}

export interface PostReviewResponse {
  error: boolean;
  message: string;
  customerReviews: CustomerReview[];
}

export interface PostReviewRequest {
  id: string;
  name: string;
  review: string;
}

// Image URL construction helper
export const getImageUrl = (pictureId: string, size: 'small' | 'medium' | 'large' = 'medium') => {
  return `https://restaurant-api.dicoding.dev/images/${size}/${pictureId}`;
};