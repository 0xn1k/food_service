# FoodHub - Food Ordering System

A modern, full-stack food ordering application built with Next.js, MongoDB, and Stripe.

## Features

- **User Authentication**: Secure signup/login with NextAuth.js and JWT
- **Browse Menu**: Filter food by category and dietary preferences (vegetarian)
- **Shopping Cart**: Add, update, and remove items
- **Checkout**: Support for both card payments (Stripe) and cash on delivery
- **Order Management**: View order history and track order status
- **Responsive Design**: Beautiful UI built with shadcn/ui and Tailwind CSS

## Tech Stack

### Frontend
- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui** components

### Backend
- **Next.js API Routes**
- **NextAuth.js** (JWT authentication)
- **MongoDB** (via MongoDB Node.js driver)

### Payments
- **Stripe** (Test mode for payments)

### Hosting
- Ready for **Vercel** deployment

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB Atlas account (or local MongoDB instance)
- Stripe account (for payment processing)

### Installation

1. Clone the repository and install dependencies:
```bash
npm install
```

2. Set up environment variables:

The `.env.local` file is already configured with MongoDB connection. Update the following:

```env
# Stripe Keys (Test Mode) - REQUIRED
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
STRIPE_SECRET_KEY=your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret_here

# NextAuth Secret - RECOMMENDED to change
NEXTAUTH_SECRET=your-super-secret-key-change-this-in-production
```

**Important**: Get your Stripe test keys from [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)

3. Seed the database with sample food items:
```bash
npm run seed
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database

MongoDB Atlas is already configured. The database includes:
- **users**: User accounts
- **foods**: Food items with categories
- **carts**: Shopping carts
- **orders**: Order history

## Stripe Setup

To test payments:

1. Get your Stripe test API keys from [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
2. Update environment variables in `.env.local`
3. For webhook testing, install Stripe CLI and run:
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```
4. Use test card: `4242 4242 4242 4242` with any future date and CVC

## Project Structure

```
food_service/
├── src/
│   ├── app/                    # Next.js app router pages
│   │   ├── api/               # API routes
│   │   ├── auth/              # Authentication pages
│   │   ├── cart/              # Shopping cart page
│   │   ├── checkout/          # Checkout page
│   │   ├── menu/              # Menu browsing page
│   │   └── orders/            # Order history pages
│   ├── components/            # React components
│   │   ├── ui/               # shadcn/ui components
│   │   └── [custom components]
│   ├── lib/                   # Utility functions
│   │   ├── db/               # Database operations
│   │   ├── mongodb.ts        # MongoDB connection
│   │   ├── auth.ts           # NextAuth configuration
│   │   └── stripe.ts         # Stripe configuration
│   └── types/                 # TypeScript type definitions
├── scripts/
│   └── seed.ts               # Database seeding script
└── .env.local                # Environment variables
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run seed` - Seed database with sample food items

## Deployment to Vercel

1. Push your code to GitHub
2. Import project to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

Make sure to:
- Update `NEXTAUTH_URL` to your production URL
- Use production Stripe keys
- Configure Stripe webhooks for your production URL

## Features to Add

- User profile management
- Order tracking with real-time updates
- Restaurant/admin dashboard
- Reviews and ratings
- Favorite foods
- Search functionality
- Discount codes/coupons

## License

MIT
