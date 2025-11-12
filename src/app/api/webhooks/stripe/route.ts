import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { updateOrderPaymentStatus, updateOrderStatus } from '@/lib/db/orders';
import { clearCart } from '@/lib/db/cart';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature' },
      { status: 400 }
    );
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    console.error('Webhook signature verification failed:', error.message);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;

      if (session.metadata?.orderId) {
        // Update order payment status
        await updateOrderPaymentStatus(session.metadata.orderId, 'paid');
        await updateOrderStatus(session.metadata.orderId, 'confirmed');

        // Clear user's cart
        if (session.metadata?.userId) {
          await clearCart(session.metadata.userId);
        }
      }
      break;

    case 'payment_intent.payment_failed':
      const failedSession = event.data.object;

      if (failedSession.metadata?.orderId) {
        await updateOrderPaymentStatus(failedSession.metadata.orderId, 'failed');
      }
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
