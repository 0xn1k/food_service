'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { CartItem as CartItemComponent } from '@/components/CartItem';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Cart } from '@/types/models';
import { toast } from 'sonner';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { cartEvents } from '@/lib/events';

export default function CartPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    if (status === 'authenticated') {
      fetchCart();
    }
  }, [status, router]);

  const fetchCart = async () => {
    try {
      const response = await fetch('/api/cart');
      if (!response.ok) throw new Error('Failed to fetch cart');
      const data = await response.json();
      setCart(data.cart);
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (foodId: string, quantity: number) => {
    try {
      const response = await fetch('/api/cart/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ foodId, quantity }),
      });

      if (!response.ok) throw new Error('Failed to update cart');

      const data = await response.json();
      setCart(data.cart);
      toast.success('Cart updated');
      cartEvents.emit('cart-updated');
    } catch (error) {
      console.error('Error updating cart:', error);
      toast.error('Failed to update cart');
    }
  };

  const handleRemove = async (foodId: string) => {
    try {
      const response = await fetch('/api/cart/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ foodId, quantity: 0 }),
      });

      if (!response.ok) throw new Error('Failed to remove item');

      const data = await response.json();
      setCart(data.cart);
      toast.success('Item removed from cart');
      cartEvents.emit('cart-updated');
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Failed to remove item');
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          <div className="h-8 w-32 bg-muted animate-pulse mb-8" />
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const isEmpty = !cart || cart.items.length === 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/30 via-background to-background">
      <div className="container py-8 md:py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 md:mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              Shopping Cart
            </h1>
            <p className="text-muted-foreground">
              Review your items and proceed to checkout
            </p>
          </div>

          {isEmpty ? (
            <div className="text-center py-20 bg-white rounded-3xl shadow-sm border">
              <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
                <ShoppingCart className="h-16 w-16 text-orange-500" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-3">Your cart is empty</h2>
              <p className="text-muted-foreground mb-8 text-lg">
                Add some delicious food to get started!
              </p>
              <Link href="/menu">
                <Button size="lg" className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                  Browse Menu
                </Button>
              </Link>
            </div>
          ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cart.items.map((item) => (
                <CartItemComponent
                  key={item.foodId.toString()}
                  item={item}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemove={handleRemove}
                />
              ))}
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-24 border-0 shadow-lg">
                <CardContent className="p-6 md:p-8">
                  <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                    Order Summary
                  </h2>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-semibold">${cart.totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Delivery Fee</span>
                      <span className="font-semibold">$3.99</span>
                    </div>
                  </div>

                  <div className="border-t-2 border-dashed pt-4 mb-6">
                    <div className="flex justify-between items-center text-xl font-bold">
                      <span>Total</span>
                      <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                        ${(cart.totalAmount + 3.99).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <Link href="/checkout">
                    <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg" size="lg">
                      Proceed to Checkout
                    </Button>
                  </Link>

                  <p className="text-xs text-muted-foreground text-center mt-4">
                    Free delivery on orders over $20
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
