// Load environment variables FIRST before any other imports
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { MongoClient } from 'mongodb';

async function testConnection() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.log('❌ MONGODB_URI not found in environment variables');
    process.exit(1);
  }

  console.log('🔍 Testing MongoDB connection...');
  console.log('📍 Connection string:', uri.replace(/:[^:@]+@/, ':****@'));

  const client = new MongoClient(uri);

  try {
    console.log('⏳ Attempting to connect...');
    await client.connect();
    console.log('✅ Successfully connected to MongoDB!');

    const db = client.db('test');
    const collections = await db.listCollections().toArray();
    console.log(`📊 Found ${collections.length} collections:`, collections.map(c => c.name));

    await client.close();
    console.log('👋 Connection closed successfully');
    process.exit(0);
  } catch (error: any) {
    console.log('\n❌ Connection failed!');
    console.log('Error:', error.message);

    if (error.message.includes('IP')) {
      console.log('\n💡 Possible solution:');
      console.log('   - Add your IP address to MongoDB Atlas Network Access');
      console.log('   - Or allow access from anywhere (0.0.0.0/0) for development');
    } else if (error.message.includes('authentication')) {
      console.log('\n💡 Possible solution:');
      console.log('   - Check your MongoDB username and password');
      console.log('   - Make sure special characters in password are URL-encoded');
    } else if (error.message.includes('SSL') || error.message.includes('TLS')) {
      console.log('\n💡 Possible solutions:');
      console.log('   - Check if MongoDB Atlas cluster is running (not paused)');
      console.log('   - Verify Network Access settings in MongoDB Atlas');
      console.log('   - Try adding &tls=true to connection string');
    }

    process.exit(1);
  }
}

testConnection();
