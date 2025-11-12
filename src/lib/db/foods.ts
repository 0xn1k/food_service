import { ObjectId } from 'mongodb';
import { getDatabase } from '@/lib/mongodb';
import { Food } from '@/types/models';

const COLLECTION_NAME = 'foods';

export async function getAllFoods(filters?: { category?: string; isVegetarian?: boolean }): Promise<Food[]> {
  const db = await getDatabase();
  const query: any = { isAvailable: true };

  if (filters?.category) {
    query.category = filters.category;
  }

  if (filters?.isVegetarian !== undefined) {
    query.isVegetarian = filters.isVegetarian;
  }

  return await db.collection<Food>(COLLECTION_NAME).find(query).sort({ createdAt: -1 }).toArray();
}

export async function getFoodById(foodId: string | ObjectId): Promise<Food | null> {
  const db = await getDatabase();
  const id = typeof foodId === 'string' ? new ObjectId(foodId) : foodId;
  return await db.collection<Food>(COLLECTION_NAME).findOne({ _id: id });
}

export async function getFoodsByIds(foodIds: (string | ObjectId)[]): Promise<Food[]> {
  const db = await getDatabase();
  const ids = foodIds.map(id => typeof id === 'string' ? new ObjectId(id) : id);
  return await db.collection<Food>(COLLECTION_NAME).find({ _id: { $in: ids } }).toArray();
}

export async function createFood(foodData: Omit<Food, '_id' | 'createdAt' | 'updatedAt'>): Promise<Food> {
  const db = await getDatabase();

  const food: Omit<Food, '_id'> = {
    ...foodData,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await db.collection<Food>(COLLECTION_NAME).insertOne(food as Food);
  return { ...food, _id: result.insertedId };
}

export async function updateFood(foodId: string | ObjectId, updates: Partial<Food>): Promise<boolean> {
  const db = await getDatabase();
  const id = typeof foodId === 'string' ? new ObjectId(foodId) : foodId;

  const result = await db.collection<Food>(COLLECTION_NAME).updateOne(
    { _id: id },
    { $set: { ...updates, updatedAt: new Date() } }
  );

  return result.modifiedCount > 0;
}

export async function getFoodCategories(): Promise<string[]> {
  const db = await getDatabase();
  return await db.collection<Food>(COLLECTION_NAME).distinct('category');
}
