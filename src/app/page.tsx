import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Clock, Star, TruckIcon, Sparkles } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 text-white">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-1/2 -left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse delay-700" />
        </div>

        <div className="container relative py-20 md:py-32 lg:py-40">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6 text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              <span>Fresh & Delicious Food</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Delicious Food
              <span className="block mt-2 bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text text-transparent">
                Delivered to Your Doorstep
              </span>
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl mb-10 text-white/90 max-w-2xl mx-auto">
              Order from our wide selection of cuisines and enjoy fast, reliable delivery right to your home
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/menu">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto text-base shadow-xl hover:shadow-2xl transition-all hover:scale-105">
                  Browse Menu
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-white text-white hover:bg-white hover:text-orange-500 transition-all hover:scale-105 shadow-xl">
                  Sign Up Now
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Wave Decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="currentColor" className="text-background"/>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Why Choose FoodHub?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Experience the best food delivery service with our commitment to quality and speed
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity" />
              <div className="relative flex flex-col items-center text-center p-8 rounded-3xl border-2 border-transparent group-hover:border-orange-200 transition-all">
                <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                  <Clock className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Fast Delivery</h3>
                <p className="text-muted-foreground text-base leading-relaxed">
                  Get your food delivered fresh and hot in 30 minutes or less
                </p>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-pink-500 rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity" />
              <div className="relative flex flex-col items-center text-center p-8 rounded-3xl border-2 border-transparent group-hover:border-red-200 transition-all">
                <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                  <Star className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Quality Food</h3>
                <p className="text-muted-foreground text-base leading-relaxed">
                  Only the best ingredients from top-rated restaurants
                </p>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-purple-500 rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity" />
              <div className="relative flex flex-col items-center text-center p-8 rounded-3xl border-2 border-transparent group-hover:border-pink-200 transition-all">
                <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                  <TruckIcon className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Track Your Order</h3>
                <p className="text-muted-foreground text-base leading-relaxed">
                  Real-time tracking from kitchen to your doorstep
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-background via-orange-50/20 to-background">
        <div className="container">
          <div className="relative overflow-hidden bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 rounded-[2.5rem] md:rounded-[3rem] text-center text-white shadow-2xl">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-3xl animate-pulse -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/20 rounded-full blur-3xl animate-pulse translate-y-1/2 -translate-x-1/2" style={{animationDelay: '1s'}} />
              <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-yellow-300/20 rounded-full blur-2xl animate-pulse -translate-x-1/2 -translate-y-1/2" style={{animationDelay: '2s'}} />
            </div>

            {/* Decorative Food Emojis */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-8 left-8 text-4xl md:text-5xl opacity-20 animate-bounce" style={{animationDuration: '3s'}}>🍕</div>
              <div className="absolute top-12 right-12 text-4xl md:text-5xl opacity-20 animate-bounce" style={{animationDuration: '4s', animationDelay: '0.5s'}}>🍔</div>
              <div className="absolute bottom-16 left-16 text-4xl md:text-5xl opacity-20 animate-bounce" style={{animationDuration: '3.5s', animationDelay: '1s'}}>🍜</div>
              <div className="absolute bottom-12 right-20 text-4xl md:text-5xl opacity-20 animate-bounce" style={{animationDuration: '4.5s', animationDelay: '1.5s'}}>🍰</div>
            </div>

            {/* Content */}
            <div className="relative z-10 px-6 py-16 md:px-12 md:py-20 lg:px-20 lg:py-24">
              <div className="max-w-4xl mx-auto">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-5 py-2.5 rounded-full mb-6 md:mb-8 text-sm md:text-base font-medium border border-white/30">
                  <Sparkles className="h-4 w-4 md:h-5 md:w-5 animate-pulse" />
                  <span>Special Offer Available</span>
                </div>

                {/* Heading */}
                <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 md:mb-6 leading-tight">
                  <span className="block">Hungry?</span>
                  <span className="block mt-2 bg-gradient-to-r from-yellow-200 via-orange-100 to-pink-200 bg-clip-text text-transparent">
                    Order Now!
                  </span>
                </h2>

                {/* Description */}
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-8 md:mb-12 text-white/95 max-w-2xl mx-auto leading-relaxed">
                  Explore our delicious menu and get your favorite food delivered fresh and hot to your doorstep in 30 minutes
                </p>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Link href="/menu">
                    <Button
                      size="lg"
                      variant="secondary"
                      className="w-full sm:w-auto text-base md:text-lg px-8 md:px-10 py-6 md:py-7 shadow-2xl hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)] transition-all hover:scale-110 font-semibold rounded-2xl bg-white text-orange-600 hover:bg-orange-50"
                    >
                      View Menu
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/cart">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto text-base md:text-lg px-8 md:px-10 py-6 md:py-7 border-2 border-white/50 bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-orange-600 transition-all hover:scale-105 font-semibold rounded-2xl shadow-xl"
                    >
                      View Cart
                    </Button>
                  </Link>
                </div>

                {/* Trust Badges */}
                <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8 mt-10 md:mt-12 pt-8 md:pt-10 border-t border-white/20">
                  <div className="flex items-center gap-2 text-white/90">
                    <Clock className="h-5 w-5" />
                    <span className="text-sm md:text-base font-medium">30 Min Delivery</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/90">
                    <Star className="h-5 w-5 fill-yellow-300 text-yellow-300" />
                    <span className="text-sm md:text-base font-medium">4.8/5 Rating</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/90">
                    <TruckIcon className="h-5 w-5" />
                    <span className="text-sm md:text-base font-medium">Free Delivery Over $20</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
