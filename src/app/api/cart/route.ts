import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getCartByUserId, addItemToCart } from '@/lib/db/cart';
import { getFoodById } from '@/lib/db/foods';
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

    const cart = await getCartByUserId(session.user.id);

    return NextResponse.json({ cart: cart || { items: [], totalAmount: 0 } }, { status: 200 });
  } catch (error) {
    console.error('Get cart error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
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

    const { foodId, quantity } = await request.json();

    if (!foodId || !quantity || quantity <= 0) {
      return NextResponse.json(
        { error: 'Invalid food ID or quantity' },
        { status: 400 }
      );
    }

    const food = await getFoodById(foodId);

    if (!food) {
      return NextResponse.json(
        { error: 'Food not found' },
        { status: 404 }
      );
    }

    if (!food.isAvailable) {
      return NextResponse.json(
        { error: 'Food is not available' },
        { status: 400 }
      );
    }

    const cart = await addItemToCart(session.user.id, {
      foodId: new ObjectId(foodId),
      name: food.name,
      price: food.price,
      quantity,
      image: food.image,
    });

    return NextResponse.json({ cart }, { status: 200 });
  } catch (error) {
    console.error('Add to cart error:', error);
    return NextResponse.json(
      { error: 'Failed to add item to cart' },
      { status: 500 }
    );
  }
}
