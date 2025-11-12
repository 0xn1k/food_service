import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { clearCart } from '@/lib/db/cart';

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await clearCart(session.user.id);

    return NextResponse.json({ message: 'Cart cleared successfully' }, { status: 200 });
  } catch (error) {
    console.error('Clear cart error:', error);
    return NextResponse.json(
      { error: 'Failed to clear cart' },
      { status: 500 }
    );
  }
}
