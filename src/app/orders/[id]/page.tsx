'use client';

import { useState, useEffect, use } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { OrderCard } from '@/components/OrderCard';
import { Button } from '@/components/ui/button';
import { Order } from '@/types/models';
import { toast } from 'sonner';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const success = searchParams.get('success');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    if (status === 'authenticated') {
      fetchOrder();
    }
  }, [status, router, resolvedParams.id]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${resolvedParams.id}`);
      if (!response.ok) throw new Error('Failed to fetch order');
      const data = await response.json();
      setOrder(data.order);
    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error('Failed to load order');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          <div className="h-8 w-32 bg-muted animate-pulse mb-8" />
          <div className="h-64 bg-muted animate-pulse rounded-lg" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-semibold mb-4">Order not found</h2>
          <Link href="/orders">
            <Button>View All Orders</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        {success === 'true' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8 flex items-start gap-4">
            <CheckCircle className="h-6 w-6 text-green-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-green-900 mb-1">Payment Successful!</h3>
              <p className="text-green-700">
                Your order has been confirmed and will be delivered soon.
              </p>
            </div>
          </div>
        )}

        <div className="mb-6">
          <Link href="/orders">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Orders
            </Button>
          </Link>
          <h1 className="text-4xl font-bold">Order Details</h1>
        </div>

        <OrderCard order={order} />
      </div>
    </div>
  );
}
