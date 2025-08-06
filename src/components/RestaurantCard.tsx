// Restaurant Card Component
import { Restaurant, getImageUrl } from '@/types/restaurant';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onClick?: () => void;
  className?: string;
}

export const RestaurantCard = ({ restaurant, onClick, className }: RestaurantCardProps) => {
  return (
    <Card 
      className={cn(
        "group cursor-pointer overflow-hidden shadow-card hover:shadow-hover transition-all duration-300 hover:scale-[1.02] bg-gradient-card border-0",
        className
      )}
      onClick={onClick}
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={getImageUrl(restaurant.pictureId, 'medium')}
          alt={restaurant.name}
          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Rating Badge */}
        <Badge 
          variant="secondary" 
          className="absolute top-3 right-3 bg-white/90 text-gray-900 font-medium shadow-sm"
        >
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 mr-1" />
          {restaurant.rating}
        </Badge>
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg text-card-foreground group-hover:text-primary transition-colors line-clamp-1">
            {restaurant.name}
          </h3>
          
          <div className="flex items-center text-muted-foreground text-sm">
            <MapPin className="w-4 h-4 mr-1 text-primary" />
            {restaurant.city}
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {restaurant.description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};