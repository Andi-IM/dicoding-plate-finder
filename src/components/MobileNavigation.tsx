// Mobile Navigation Component
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Utensils, Home, Search } from 'lucide-react';

interface MobileNavigationProps {
  onSearchToggle?: () => void;
}

export const MobileNavigation = ({ onSearchToggle }: MobileNavigationProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Utensils className="w-8 h-8 text-primary mr-2" />
            <span className="text-xl font-bold text-foreground">CulinaryCompass</span>
          </div>

          {/* Mobile Menu */}
          <div className="flex items-center gap-2">
            {onSearchToggle && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onSearchToggle}
                className="h-11 w-11"
                aria-label="Toggle search"
              >
                <Search className="w-5 h-5" />
              </Button>
            )}
            
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-11 w-11"
                  aria-label="Open menu"
                >
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-6 mt-8">
                  <div className="flex items-center">
                    <Utensils className="w-6 h-6 text-primary mr-3" />
                    <span className="text-lg font-semibold">CulinaryCompass</span>
                  </div>
                  
                  <nav className="space-y-4">
                    <Button
                      variant="ghost"
                      className="w-full justify-start h-12 text-base"
                      onClick={() => setIsOpen(false)}
                    >
                      <Home className="w-5 h-5 mr-3" />
                      Home
                    </Button>
                    
                    <Button
                      variant="ghost"
                      className="w-full justify-start h-12 text-base"
                      onClick={() => {
                        onSearchToggle?.();
                        setIsOpen(false);
                      }}
                    >
                      <Search className="w-5 h-5 mr-3" />
                      Search
                    </Button>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </div>
  );
};