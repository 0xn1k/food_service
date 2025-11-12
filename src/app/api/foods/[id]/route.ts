import { NextRequest, NextResponse } from 'next/server';
import { getFoodById } from '@/lib/db/foods';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const food = await getFoodById(id);

    if (!food) {
      return NextResponse.json(
        { error: 'Food not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ food }, { status: 200 });
  } catch (error) {
    console.error('Get food error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch food' },
      { status: 500 }
    );
  }
}
