import { ObjectId } from 'mongodb';
import { getDatabase } from '@/lib/mongodb';
import { User } from '@/types/models';
import bcrypt from 'bcryptjs';

const COLLECTION_NAME = 'users';

export async function createUser(userData: Omit<User, '_id' | 'createdAt' | 'updatedAt'>): Promise<User> {
  const db = await getDatabase();
  const hashedPassword = await bcrypt.hash(userData.password, 10);

  const user: Omit<User, '_id'> = {
    ...userData,
    password: hashedPassword,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await db.collection<User>(COLLECTION_NAME).insertOne(user as User);
  return { ...user, _id: result.insertedId };
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const db = await getDatabase();
  return await db.collection<User>(COLLECTION_NAME).findOne({ email });
}

export async function getUserById(userId: string | ObjectId): Promise<User | null> {
  const db = await getDatabase();
  const id = typeof userId === 'string' ? new ObjectId(userId) : userId;
  return await db.collection<User>(COLLECTION_NAME).findOne({ _id: id });
}

export async function updateUser(userId: string | ObjectId, updates: Partial<User>): Promise<boolean> {
  const db = await getDatabase();
  const id = typeof userId === 'string' ? new ObjectId(userId) : userId;

  const result = await db.collection<User>(COLLECTION_NAME).updateOne(
    { _id: id },
    { $set: { ...updates, updatedAt: new Date() } }
  );

  return result.modifiedCount > 0;
}

export async function verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(plainPassword, hashedPassword);
}
