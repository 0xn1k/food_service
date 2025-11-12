import { ObjectId } from 'mongodb';
import { getDatabase } from '@/lib/mongodb';
import { Cart, CartItem } from '@/types/models';

const COLLECTION_NAME = 'carts';

export async function getCartByUserId(userId: string | ObjectId): Promise<Cart | null> {
  const db = await getDatabase();
  const id = typeof userId === 'string' ? new ObjectId(userId) : userId;
  return await db.collection<Cart>(COLLECTION_NAME).findOne({ userId: id });
}

export async function createCart(userId: string | ObjectId): Promise<Cart> {
  const db = await getDatabase();
  const id = typeof userId === 'string' ? new ObjectId(userId) : userId;

  const cart: Omit<Cart, '_id'> = {
    userId: id,
    items: [],
    totalAmount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await db.collection<Cart>(COLLECTION_NAME).insertOne(cart as Cart);
  return { ...cart, _id: result.insertedId };
}

export async function addItemToCart(
  userId: string | ObjectId,
  item: CartItem
): Promise<Cart | null> {
  const db = await getDatabase();
  const id = typeof userId === 'string' ? new ObjectId(userId) : userId;

  let cart = await getCartByUserId(id);

  if (!cart) {
    cart = await createCart(id);
  }

  const existingItemIndex = cart.items.findIndex(
    (i) => i.foodId.toString() === item.foodId.toString()
  );

  if (existingItemIndex > -1) {
    cart.items[existingItemIndex].quantity += item.quantity;
  } else {
    cart.items.push(item);
  }

  cart.totalAmount = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  cart.updatedAt = new Date();

  await db.collection<Cart>(COLLECTION_NAME).updateOne(
    { userId: id },
    { $set: { items: cart.items, totalAmount: cart.totalAmount, updatedAt: cart.updatedAt } }
  );

  return cart;
}

export async function updateCartItem(
  userId: string | ObjectId,
  foodId: string | ObjectId,
  quantity: number
): Promise<Cart | null> {
  const db = await getDatabase();
  const id = typeof userId === 'string' ? new ObjectId(userId) : userId;
  const fId = typeof foodId === 'string' ? new ObjectId(foodId) : foodId;

  const cart = await getCartByUserId(id);
  if (!cart) return null;

  const itemIndex = cart.items.findIndex((i) => i.foodId.toString() === fId.toString());

  if (itemIndex === -1) return null;

  if (quantity <= 0) {
    cart.items.splice(itemIndex, 1);
  } else {
    cart.items[itemIndex].quantity = quantity;
  }

  cart.totalAmount = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  cart.updatedAt = new Date();

  await db.collection<Cart>(COLLECTION_NAME).updateOne(
    { userId: id },
    { $set: { items: cart.items, totalAmount: cart.totalAmount, updatedAt: cart.updatedAt } }
  );

  return cart;
}

export async function removeItemFromCart(
  userId: string | ObjectId,
  foodId: string | ObjectId
): Promise<Cart | null> {
  return await updateCartItem(userId, foodId, 0);
}

export async function clearCart(userId: string | ObjectId): Promise<boolean> {
  const db = await getDatabase();
  const id = typeof userId === 'string' ? new ObjectId(userId) : userId;

  const result = await db.collection<Cart>(COLLECTION_NAME).updateOne(
    { userId: id },
    { $set: { items: [], totalAmount: 0, updatedAt: new Date() } }
  );

  return result.modifiedCount > 0;
}
