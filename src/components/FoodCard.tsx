'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus, ShoppingCart, Clock, Leaf } from 'lucide-react';
import { Food } from '@/types/models';

interface FoodCardProps {
  food: Food;
  onAddToCart: (foodId: string, quantity: number) => Promise<void>;
}

export function FoodCard({ food, onAddToCart }: FoodCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      await onAddToCart(food._id!.toString(), quantity);
      setQuantity(1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="group overflow-hidden border-0 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
      <div className="relative h-56 w-full overflow-hidden bg-gradient-to-br from-orange-50 to-red-50">
        <Image
          src={food.image}
          alt={food.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {food.isVegetarian && (
          <Badge className="absolute top-3 right-3 bg-green-500 hover:bg-green-600 shadow-lg">
            <Leaf className="h-3 w-3 mr-1" />
            Veg
          </Badge>
        )}

        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="font-bold text-xl text-white drop-shadow-lg mb-1">{food.name}</h3>
          <div className="flex items-center gap-2 text-white/90 text-sm">
            <Clock className="h-3.5 w-3.5" />
            <span>{food.preparationTime} mins</span>
          </div>
        </div>
      </div>

      <CardContent className="p-5">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 min-h-[40px]">
          {food.description}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Price</p>
            <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              ${food.price.toFixed(2)}
            </span>
          </div>

          <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-md hover:bg-background"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="px-2 font-semibold min-w-[24px] text-center">{quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-md hover:bg-background"
              onClick={() => setQuantity(quantity + 1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Button
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-md"
          onClick={handleAddToCart}
          disabled={!food.isAvailable || loading}
          size="lg"
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {loading ? 'Adding...' : 'Add to Cart'}
        </Button>
      </CardContent>
    </Card>
  );
}
