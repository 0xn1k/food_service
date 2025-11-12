'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, User, LogOut, Menu } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cartEvents } from '@/lib/events';

export function Navbar() {
  const { data: session } = useSession();
  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    if (session) {
      fetchCartCount();

      // Listen for cart update events
      const handleCartUpdate = () => fetchCartCount();
      cartEvents.on('cart-updated', handleCartUpdate);

      return () => {
        cartEvents.off('cart-updated', handleCartUpdate);
      };
    }
  }, [session]);

  const fetchCartCount = async () => {
    try {
      const response = await fetch('/api/cart');
      if (response.ok) {
        const data = await response.json();
        const count = data.cart?.items?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0;
        setCartItemCount(count);
      }
    } catch (error) {
      console.error('Error fetching cart count:', error);
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              FoodHub
            </span>
          </Link>

          <div className="hidden md:flex gap-6">
            <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
              Home
            </Link>
            <Link href="/menu" className="text-sm font-medium transition-colors hover:text-primary">
              Menu
            </Link>
            {session && (
              <Link href="/orders" className="text-sm font-medium transition-colors hover:text-primary">
                Orders
              </Link>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {session && (
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {cartItemCount}
                  </Badge>
                )}
              </Button>
            </Link>
          )}

          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/orders">My Orders</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex gap-2">
              <Link href="/auth/signin">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/auth/signup">
                <Button>Sign Up</Button>
              </Link>
            </div>
          )}

          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col gap-4 mt-8">
                <Link href="/" className="text-lg font-medium">
                  Home
                </Link>
                <Link href="/menu" className="text-lg font-medium">
                  Menu
                </Link>
                {session ? (
                  <>
                    <Link href="/orders" className="text-lg font-medium">
                      Orders
                    </Link>
                    <Link href="/profile" className="text-lg font-medium">
                      Profile
                    </Link>
                    <Button onClick={() => signOut()} variant="outline">
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/auth/signin">
                      <Button variant="ghost" className="w-full">Sign In</Button>
                    </Link>
                    <Link href="/auth/signup">
                      <Button className="w-full">Sign Up</Button>
                    </Link>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
