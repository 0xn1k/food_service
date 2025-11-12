import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { updateCartItem } from '@/lib/db/cart';

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { foodId, quantity } = await request.json();

    if (!foodId || quantity < 0) {
      return NextResponse.json(
        { error: 'Invalid food ID or quantity' },
        { status: 400 }
      );
    }

    const cart = await updateCartItem(session.user.id, foodId, quantity);

    if (!cart) {
      return NextResponse.json(
        { error: 'Cart or item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ cart }, { status: 200 });
  } catch (error) {
    console.error('Update cart error:', error);
    return NextResponse.json(
      { error: 'Failed to update cart' },
      { status: 500 }
    );
  }
}
