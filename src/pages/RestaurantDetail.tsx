// Restaurant Detail Page
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRestaurantDetail, usePostReview } from '@/hooks/useRestaurants';
import { getImageUrl } from '@/types/restaurant';
import { RestaurantDetailSkeleton } from '@/components/LoadingSkeletons';
import { MobileNavigation } from '@/components/MobileNavigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  Clock, 
  Utensils, 
  Coffee,
  MessageSquare,
  User,
  Send,
  AlertCircle
} from 'lucide-react';

export const RestaurantDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewName, setReviewName] = useState('');
  const [reviewText, setReviewText] = useState('');

  const { data, isLoading, error } = useRestaurantDetail(id!);
  const postReviewMutation = usePostReview();

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reviewName.trim() || !reviewText.trim()) {
      return;
    }

    try {
      await postReviewMutation.mutateAsync({
        id: id!,
        name: reviewName.trim(),
        review: reviewText.trim(),
      });
      
      // Reset form
      setReviewName('');
      setReviewText('');
      setShowReviewForm(false);
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <div className="container mx-auto px-4 py-8">
          <RestaurantDetailSkeleton />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="container mx-auto px-4">
          <Alert className="max-w-md mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load restaurant details. Please try again later.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  const restaurant = data.restaurant;

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Mobile Navigation */}
      <MobileNavigation />
      
      <div className="pt-16 lg:pt-0"> {/* Offset for mobile nav */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6 hover:bg-primary/10 h-11 px-4"
          aria-label="Back to restaurants"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Restaurants
        </Button>

        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  {restaurant.name}
                </h1>
                <div className="flex items-center space-x-4 text-muted-foreground">
                  <div className="flex items-center">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="font-medium text-foreground">{restaurant.rating}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1 text-primary" />
                    {restaurant.city}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                {restaurant.categories.map((category) => (
                  <Badge key={category.name} variant="secondary">
                    {category.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Restaurant Image */}
          <div className="relative">
            <img
              src={getImageUrl(restaurant.pictureId, 'large')}
              alt={restaurant.name}
              className="w-full h-64 md:h-96 object-cover rounded-xl shadow-card"
            />
          </div>

          {/* Description and Address */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <Card className="bg-gradient-card border-0 shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Utensils className="w-5 h-5 mr-2 text-primary" />
                    About This Restaurant
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {restaurant.description}
                  </p>
                </CardContent>
              </Card>

              {/* Menus */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Food Menu */}
                <Card className="bg-gradient-card border-0 shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <Utensils className="w-5 h-5 mr-2 text-primary" />
                      Food Menu
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {restaurant.menus.foods.map((food, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-foreground">{food.name}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Drinks Menu */}
                <Card className="bg-gradient-card border-0 shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <Coffee className="w-5 h-5 mr-2 text-primary" />
                      Drinks Menu
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {restaurant.menus.drinks.map((drink, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-foreground">{drink.name}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Address Sidebar */}
            <div className="space-y-6">
              <Card className="bg-gradient-card border-0 shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <MapPin className="w-5 h-5 mr-2 text-primary" />
                    Location
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="font-medium text-foreground">{restaurant.city}</p>
                    <p className="text-muted-foreground text-sm">
                      {restaurant.address}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Reviews Section */}
          <Card className="bg-gradient-card border-0 shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2 text-primary" />
                  Customer Reviews ({restaurant.customerReviews.length})
                </CardTitle>
                <Button 
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  variant="outline"
                  className="h-11 px-4"
                  aria-label="Write a review"
                >
                  Write Review
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Review Form */}
                {showReviewForm && (
                  <Card className="bg-muted/50">
                    <CardContent className="pt-6">
                      <form onSubmit={handleSubmitReview} className="space-y-4">
                        <div>
                          <Input
                            type="text"
                            placeholder="Your name"
                            value={reviewName}
                            onChange={(e) => setReviewName(e.target.value)}
                            required
                            className="h-11"
                            aria-label="Your name"
                          />
                        </div>
                        <div>
                          <Textarea
                            placeholder="Share your experience..."
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            required
                            rows={4}
                            aria-label="Your review"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            type="submit" 
                            disabled={postReviewMutation.isPending || !reviewName.trim() || !reviewText.trim()}
                            className="h-11 px-6"
                          >
                            {postReviewMutation.isPending ? (
                              <>Submitting...</>
                            ) : (
                              <>
                                <Send className="w-4 h-4 mr-2" />
                                Submit Review
                              </>
                            )}
                          </Button>
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => setShowReviewForm(false)}
                            className="h-11 px-6"
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                )}

                <Separator />

                {/* Reviews List */}
                <div className="space-y-4">
                  {restaurant.customerReviews.map((review, index) => (
                    <Card key={index} className="bg-white/50">
                      <CardContent className="pt-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <User className="w-4 h-4 mr-2 text-primary" />
                              <span className="font-medium text-foreground">{review.name}</span>
                            </div>
                            <div className="flex items-center text-muted-foreground text-sm">
                              <Clock className="w-3 h-3 mr-1" />
                              {review.date}
                            </div>
                          </div>
                          <p className="text-muted-foreground leading-relaxed pl-6">
                            {review.review}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        </div> {/* Close pt-16 wrapper */}
      </div>
    </div>
  );
};