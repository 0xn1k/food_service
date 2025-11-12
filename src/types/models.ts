import { ObjectId } from 'mongodb';

export interface User {
  _id?: ObjectId;
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Food {
  _id?: ObjectId;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  isVegetarian: boolean;
  isAvailable: boolean;
  rating?: number;
  preparationTime: number; // in minutes
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  foodId: ObjectId;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Cart {
  _id?: ObjectId;
  userId: ObjectId;
  items: CartItem[];
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  foodId: ObjectId;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  _id?: ObjectId;
  userId: ObjectId;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'out-for-delivery' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed';
  paymentMethod: 'card' | 'cash';
  stripeSessionId?: string;
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  contactPhone: string;
  createdAt: Date;
  updatedAt: Date;
  deliveredAt?: Date;
}
