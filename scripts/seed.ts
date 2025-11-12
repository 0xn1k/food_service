// Load environment variables FIRST before any other imports
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { getDatabase } from '../src/lib/mongodb';
import { Food } from '../src/types/models';

const sampleFoods: Omit<Food, '_id' | 'createdAt' | 'updatedAt'>[] = [
  // Pizza
  {
    name: 'Margherita Pizza',
    description: 'Classic pizza with fresh mozzarella, tomatoes, and basil',
    price: 12.99,
    category: 'Pizza',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400',
    isVegetarian: true,
    isAvailable: true,
    preparationTime: 25,
  },
  {
    name: 'Pepperoni Pizza',
    description: 'Loaded with pepperoni and mozzarella cheese',
    price: 14.99,
    category: 'Pizza',
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400',
    isVegetarian: false,
    isAvailable: true,
    preparationTime: 25,
  },
  {
    name: 'Veggie Supreme Pizza',
    description: 'Bell peppers, onions, mushrooms, olives, and tomatoes',
    price: 13.99,
    category: 'Pizza',
    image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96a47?w=400',
    isVegetarian: true,
    isAvailable: true,
    preparationTime: 30,
  },

  // Burgers
  {
    name: 'Classic Cheeseburger',
    description: 'Juicy beef patty with cheese, lettuce, tomato, and special sauce',
    price: 10.99,
    category: 'Burgers',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
    isVegetarian: false,
    isAvailable: true,
    preparationTime: 15,
  },
  {
    name: 'Veggie Burger',
    description: 'Plant-based patty with fresh veggies and vegan mayo',
    price: 11.99,
    category: 'Burgers',
    image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=400',
    isVegetarian: true,
    isAvailable: true,
    preparationTime: 15,
  },
  {
    name: 'Bacon Deluxe Burger',
    description: 'Double patty with crispy bacon, cheese, and BBQ sauce',
    price: 15.99,
    category: 'Burgers',
    image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400',
    isVegetarian: false,
    isAvailable: true,
    preparationTime: 20,
  },

  // Pasta
  {
    name: 'Spaghetti Carbonara',
    description: 'Creamy pasta with bacon, eggs, and parmesan',
    price: 13.99,
    category: 'Pasta',
    image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400',
    isVegetarian: false,
    isAvailable: true,
    preparationTime: 20,
  },
  {
    name: 'Penne Arrabbiata',
    description: 'Spicy tomato sauce with garlic and herbs',
    price: 11.99,
    category: 'Pasta',
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400',
    isVegetarian: true,
    isAvailable: true,
    preparationTime: 18,
  },
  {
    name: 'Fettuccine Alfredo',
    description: 'Rich and creamy parmesan sauce',
    price: 12.99,
    category: 'Pasta',
    image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=400',
    isVegetarian: true,
    isAvailable: true,
    preparationTime: 20,
  },

  // Sushi
  {
    name: 'California Roll',
    description: 'Crab, avocado, and cucumber roll',
    price: 9.99,
    category: 'Sushi',
    image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
    isVegetarian: false,
    isAvailable: true,
    preparationTime: 10,
  },
  {
    name: 'Salmon Nigiri',
    description: 'Fresh salmon over seasoned rice (8 pieces)',
    price: 14.99,
    category: 'Sushi',
    image: 'https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?w=400',
    isVegetarian: false,
    isAvailable: true,
    preparationTime: 12,
  },
  {
    name: 'Veggie Roll',
    description: 'Cucumber, avocado, and carrot roll',
    price: 8.99,
    category: 'Sushi',
    image: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=400',
    isVegetarian: true,
    isAvailable: true,
    preparationTime: 10,
  },

  // Salads
  {
    name: 'Caesar Salad',
    description: 'Romaine lettuce, croutons, parmesan, and Caesar dressing',
    price: 8.99,
    category: 'Salads',
    image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400',
    isVegetarian: true,
    isAvailable: true,
    preparationTime: 10,
  },
  {
    name: 'Greek Salad',
    description: 'Tomatoes, cucumber, olives, feta cheese, and olive oil',
    price: 9.99,
    category: 'Salads',
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400',
    isVegetarian: true,
    isAvailable: true,
    preparationTime: 8,
  },

  // Desserts
  {
    name: 'Chocolate Lava Cake',
    description: 'Warm chocolate cake with molten center',
    price: 7.99,
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400',
    isVegetarian: true,
    isAvailable: true,
    preparationTime: 15,
  },
  {
    name: 'Tiramisu',
    description: 'Classic Italian coffee-flavored dessert',
    price: 8.99,
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400',
    isVegetarian: true,
    isAvailable: true,
    preparationTime: 5,
  },
];

async function seed() {
  try {
    console.log('🌱 Starting database seeding...');

    const db = await getDatabase();
    const foodsCollection = db.collection<Food>('foods');

    // Clear existing foods
    await foodsCollection.deleteMany({});
    console.log('🗑️  Cleared existing food items');

    // Insert sample foods
    const foodsWithTimestamps = sampleFoods.map(food => ({
      ...food,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    const result = await foodsCollection.insertMany(foodsWithTimestamps as Food[]);
    console.log(`✅ Inserted ${result.insertedCount} food items`);

    console.log('🎉 Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();
