import { ObjectId } from 'mongodb';
import { getDatabase } from '@/lib/mongodb';
import { Order } from '@/types/models';

const COLLECTION_NAME = 'orders';

export async function createOrder(orderData: Omit<Order, '_id' | 'createdAt' | 'updatedAt'>): Promise<Order> {
  const db = await getDatabase();

  const order: Omit<Order, '_id'> = {
    ...orderData,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await db.collection<Order>(COLLECTION_NAME).insertOne(order as Order);
  return { ...order, _id: result.insertedId };
}

export async function getOrderById(orderId: string | ObjectId): Promise<Order | null> {
  const db = await getDatabase();
  const id = typeof orderId === 'string' ? new ObjectId(orderId) : orderId;
  return await db.collection<Order>(COLLECTION_NAME).findOne({ _id: id });
}

export async function getOrdersByUserId(userId: string | ObjectId): Promise<Order[]> {
  const db = await getDatabase();
  const id = typeof userId === 'string' ? new ObjectId(userId) : userId;
  return await db.collection<Order>(COLLECTION_NAME)
    .find({ userId: id })
    .sort({ createdAt: -1 })
    .toArray();
}

export async function updateOrderStatus(
  orderId: string | ObjectId,
  status: Order['status']
): Promise<boolean> {
  const db = await getDatabase();
  const id = typeof orderId === 'string' ? new ObjectId(orderId) : orderId;

  const updates: any = { status, updatedAt: new Date() };

  if (status === 'delivered') {
    updates.deliveredAt = new Date();
  }

  const result = await db.collection<Order>(COLLECTION_NAME).updateOne(
    { _id: id },
    { $set: updates }
  );

  return result.modifiedCount > 0;
}

export async function updateOrderPaymentStatus(
  orderId: string | ObjectId,
  paymentStatus: Order['paymentStatus']
): Promise<boolean> {
  const db = await getDatabase();
  const id = typeof orderId === 'string' ? new ObjectId(orderId) : orderId;

  const result = await db.collection<Order>(COLLECTION_NAME).updateOne(
    { _id: id },
    { $set: { paymentStatus, updatedAt: new Date() } }
  );

  return result.modifiedCount > 0;
}

export async function getOrderByStripeSessionId(sessionId: string): Promise<Order | null> {
  const db = await getDatabase();
  return await db.collection<Order>(COLLECTION_NAME).findOne({ stripeSessionId: sessionId });
}
