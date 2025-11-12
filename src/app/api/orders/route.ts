import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createOrder, getOrdersByUserId } from '@/lib/db/orders';
import { getCartByUserId, clearCart } from '@/lib/db/cart';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const orders = await getOrdersByUserId(session.user.id);

    return NextResponse.json({ orders }, { status: 200 });
  } catch (error) {
    console.error('Get orders error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { deliveryAddress, contactPhone, paymentMethod } = await request.json();

    if (!deliveryAddress || !contactPhone || !paymentMethod) {
      return NextResponse.json(
        { error: 'Missing required fields' },
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
      paymentStatus: paymentMethod === 'cash' ? 'pending' : 'pending',
      paymentMethod,
      deliveryAddress,
      contactPhone,
    });

    // Clear the cart after creating order
    await clearCart(session.user.id);

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
