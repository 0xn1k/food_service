'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { CartItem as CartItemType } from '@/types/models';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (foodId: string, quantity: number) => Promise<void>;
  onRemove: (foodId: string) => Promise<void>;
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const [loading, setLoading] = useState(false);

  const handleUpdateQuantity = async (newQuantity: number) => {
    if (newQuantity < 1) return;
    setLoading(true);
    try {
      await onUpdateQuantity(item.foodId.toString(), newQuantity);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    setLoading(true);
    try {
      await onRemove(item.foodId.toString());
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow">
      <CardContent className="p-4 md:p-6">
        <div className="flex gap-4 md:gap-6">
          <div className="relative h-24 w-24 md:h-28 md:w-28 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-orange-50 to-red-50">
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover"
            />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg md:text-xl mb-1 truncate">{item.name}</h3>
            <p className="text-sm text-muted-foreground mb-3">
              ${item.price.toFixed(2)} each
            </p>

            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-md hover:bg-background"
                  onClick={() => handleUpdateQuantity(item.quantity - 1)}
                  disabled={loading || item.quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="px-2 text-sm font-semibold min-w-[24px] text-center">{item.quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-md hover:bg-background"
                  onClick={() => handleUpdateQuantity(item.quantity + 1)}
                  disabled={loading}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={handleRemove}
                disabled={loading}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="text-right flex flex-col justify-between">
            <p className="font-bold text-xl md:text-2xl bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              ${(item.price * item.quantity).toFixed(2)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
