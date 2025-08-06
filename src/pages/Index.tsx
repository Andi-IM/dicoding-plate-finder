// CulinaryCompass Main App Router
import { useParams } from 'react-router-dom';
import { RestaurantList } from './RestaurantList';
import { RestaurantDetail } from './RestaurantDetail';

const Index = () => {
  const { id } = useParams();
  
  // Route to appropriate component based on URL
  if (id) {
    return <RestaurantDetail />;
  }
  
  return <RestaurantList />;
};

export default Index;
