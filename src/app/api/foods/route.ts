import { NextRequest, NextResponse } from 'next/server';
import { getAllFoods, getFoodCategories } from '@/lib/db/foods';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category') || undefined;
    const isVegetarian = searchParams.get('vegetarian') === 'true' ? true : undefined;

    const foods = await getAllFoods({ category, isVegetarian });

    return NextResponse.json({ foods }, { status: 200 });
  } catch (error) {
    console.error('Get foods error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch foods' },
      { status: 500 }
    );
  }
}
