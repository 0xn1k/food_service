'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Cart } from '@/types/models';
import { toast } from 'sonner';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash'>('card');

  const [formData, setFormData] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
  });

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

      if (!data.cart || data.cart.items.length === 0) {
        toast.error('Your cart is empty');
        router.push('/menu');
        return;
      }

      setCart(data.cart);
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.street || !formData.city || !formData.state || !formData.zipCode || !formData.phone) {
      toast.error('Please fill in all fields');
      return;
    }

    setProcessing(true);

    try {
      if (paymentMethod === 'card') {
        // Stripe checkout
        const response = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            deliveryAddress: {
              street: formData.street,
              city: formData.city,
              state: formData.state,
              zipCode: formData.zipCode,
            },
            contactPhone: formData.phone,
          }),
        });

        if (!response.ok) throw new Error('Failed to create checkout session');

        const { url } = await response.json();
        window.location.href = url;
      } else {
        // Cash on delivery
        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            deliveryAddress: {
              street: formData.street,
              city: formData.city,
              state: formData.state,
              zipCode: formData.zipCode,
            },
            contactPhone: formData.phone,
            paymentMethod: 'cash',
          }),
        });

        if (!response.ok) throw new Error('Failed to create order');

        const { order } = await response.json();
        toast.success('Order placed successfully!');
        router.push(`/orders/${order._id}`);
      }
    } catch (error) {
      console.error('Error processing order:', error);
      toast.error('Failed to process order');
      setProcessing(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          <div className="h-8 w-32 bg-muted animate-pulse mb-8" />
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="h-[400px] bg-muted animate-pulse rounded-lg" />
            <div className="h-[400px] bg-muted animate-pulse rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <form onSubmit={handleSubmit}>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Delivery Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="street">Street Address</Label>
                    <Input
                      id="street"
                      name="street"
                      value={formData.street}
                      onChange={handleInputChange}
                      placeholder="123 Main St"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="New York"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder="NY"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      placeholder="10001"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="(555) 123-4567"
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as 'card' | 'cash')}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="card">Credit Card</TabsTrigger>
                      <TabsTrigger value="cash">Cash on Delivery</TabsTrigger>
                    </TabsList>
                    <TabsContent value="card" className="mt-4">
                      <p className="text-sm text-muted-foreground">
                        You will be redirected to Stripe to complete your payment securely.
                      </p>
                    </TabsContent>
                    <TabsContent value="cash" className="mt-4">
                      <p className="text-sm text-muted-foreground">
                        Pay with cash when your order is delivered.
                      </p>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              <Button
                type="submit"
                className="w-full mt-6"
                size="lg"
                disabled={processing}
              >
                {processing ? 'Processing...' : `Place Order - $${cart ? (cart.totalAmount + 3.99).toFixed(2) : '0.00'}`}
              </Button>
            </form>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cart?.items.map((item) => (
                    <div key={item.foodId.toString()} className="flex justify-between text-sm">
                      <span>
                        {item.name} x {item.quantity}
                      </span>
                      <span className="font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}

                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${cart?.totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Delivery Fee</span>
                      <span>$3.99</span>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>${cart ? (cart.totalAmount + 3.99).toFixed(2) : '0.00'}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
