import { NextResponse } from 'next/server';
import { getFoodCategories } from '@/lib/db/foods';

export async function GET() {
  try {
    const categories = await getFoodCategories();
    return NextResponse.json({ categories }, { status: 200 });
  } catch (error) {
    console.error('Get categories error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
