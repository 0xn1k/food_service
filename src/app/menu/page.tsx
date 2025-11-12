'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FoodCard } from '@/components/FoodCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Food } from '@/types/models';
import { toast } from 'sonner';
import { cartEvents } from '@/lib/events';
import { ShoppingCart, Leaf } from 'lucide-react';

export default function MenuPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [foods, setFoods] = useState<Food[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [vegetarianOnly, setVegetarianOnly] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
    fetchFoods();
  }, [selectedCategory, vegetarianOnly]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/foods/categories');
      const data = await response.json();
      setCategories(['all', ...data.categories]);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchFoods = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') {
        params.append('category', selectedCategory);
      }
      if (vegetarianOnly) {
        params.append('vegetarian', 'true');
      }

      const response = await fetch(`/api/foods?${params}`);
      const data = await response.json();
      setFoods(data.foods);
    } catch (error) {
      console.error('Error fetching foods:', error);
      toast.error('Failed to load menu');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (foodId: string, quantity: number) => {
    if (!session) {
      toast.error('Please sign in to add items to cart');
      router.push('/auth/signin');
      return;
    }

    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ foodId, quantity }),
      });

      if (!response.ok) {
        throw new Error('Failed to add to cart');
      }

      toast.success('Added to cart!');
      cartEvents.emit('cart-updated');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/30 via-background to-background">
      <div className="container py-8 md:py-12">
        {/* Header */}
        <div className="text-center mb-10 md:mb-14">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-3 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent">
            Our Menu
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover our delicious selection of handcrafted dishes
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 md:mb-12">
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="flex-1">
            <TabsList className="w-full md:w-auto inline-flex h-11 items-center justify-center rounded-xl bg-muted p-1 text-muted-foreground">
              {categories.map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className="capitalize rounded-lg px-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <Button
            variant={vegetarianOnly ? 'default' : 'outline'}
            onClick={() => setVegetarianOnly(!vegetarianOnly)}
            className={vegetarianOnly ? 'bg-green-500 hover:bg-green-600' : ''}
            size="lg"
          >
            <Leaf className="mr-2 h-4 w-4" />
            Vegetarian Only
          </Button>
        </div>

        {/* Food Grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-[420px] bg-muted animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : foods.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <ShoppingCart className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">No items found</h3>
            <p className="text-muted-foreground">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {foods.map((food) => (
              <FoodCard key={food._id!.toString()} food={food} onAddToCart={handleAddToCart} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
