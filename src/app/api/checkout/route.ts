import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { stripe } from '@/lib/stripe';
import { getCartByUserId } from '@/lib/db/cart';
import { createOrder } from '@/lib/db/orders';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { deliveryAddress, contactPhone } = await request.json();

    if (!deliveryAddress || !contactPhone) {
      return NextResponse.json(
        { error: 'Missing delivery information' },
        { status: 400 }
      );
    }

    const cart = await getCartByUserId(session.user.id);

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }

    // Create pending order
    const order = await createOrder({
      userId: new ObjectId(session.user.id),
      items: cart.items.map(item => ({
        foodId: item.foodId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
      totalAmount: cart.totalAmount,
      status: 'pending',
      paymentStatus: 'pending',
      paymentMethod: 'card',
      deliveryAddress,
      contactPhone,
    });

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: cart.items.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            images: [item.image],
          },
          unit_amount: Math.round(item.price * 100), // Convert to cents
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${process.env.NEXTAUTH_URL}/orders/${order._id}?success=true`,
      cancel_url: `${process.env.NEXTAUTH_URL}/checkout?canceled=true`,
      metadata: {
        orderId: order._id!.toString(),
        userId: session.user.id,
      },
    });

    return NextResponse.json({ sessionId: checkoutSession.id, url: checkoutSession.url }, { status: 200 });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
