'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Order } from '@/types/models';
import { Clock, MapPin, CreditCard } from 'lucide-react';

interface OrderCardProps {
  order: Order;
}

const statusColors = {
  pending: 'bg-yellow-500',
  confirmed: 'bg-blue-500',
  preparing: 'bg-purple-500',
  'out-for-delivery': 'bg-orange-500',
  delivered: 'bg-green-500',
  cancelled: 'bg-red-500',
};

const paymentStatusColors = {
  pending: 'bg-yellow-500',
  paid: 'bg-green-500',
  failed: 'bg-red-500',
};

export function OrderCard({ order }: OrderCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">
              Order #{order._id?.toString().slice(-8)}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {new Date(order.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
          <div className="flex flex-col gap-2 items-end">
            <Badge className={statusColors[order.status]}>
              {order.status.replace('-', ' ').toUpperCase()}
            </Badge>
            <Badge className={paymentStatusColors[order.paymentStatus]}>
              {order.paymentStatus.toUpperCase()}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Items</h4>
            <div className="space-y-2">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span className="font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center gap-2 text-sm mb-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>
                {order.deliveryAddress.street}, {order.deliveryAddress.city},{' '}
                {order.deliveryAddress.state} {order.deliveryAddress.zipCode}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <span className="capitalize">{order.paymentMethod}</span>
            </div>
          </div>

          <div className="border-t pt-4 flex justify-between items-center">
            <span className="font-semibold">Total Amount</span>
            <span className="text-2xl font-bold text-primary">
              ${order.totalAmount.toFixed(2)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
