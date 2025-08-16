import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { Product, Banner, Category } from '../../models/product.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductCardComponent],
  template: `
    <!-- Hero Banner Carousel -->
    <section class="bg-white">
      <div class="container-custom">
        <div class="relative h-64 md:h-80 lg:h-96 overflow-hidden rounded-lg">
          @if (banners().length > 0) {
            <div class="relative h-full">
              @for (banner of banners(); track banner.id; let i = $index) {
                <div 
                  class="absolute inset-0 transition-opacity duration-500"
                  [class.opacity-100]="currentBannerIndex() === i"
                  [class.opacity-0]="currentBannerIndex() !== i"
                >
                  <img
                    [src]="banner.image"
                    [alt]="banner.title"
                    class="w-full h-full object-cover"
                  >
                  <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center">
                    <div class="container-custom">
                      <div class="text-white max-w-lg">
                        <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">{{ banner.title }}</h1>
                        @if (banner.subtitle) {
                          <p class="text-lg md:text-xl mb-6">{{ banner.subtitle }}</p>
                        }
                        @if (banner.buttonText && banner.link) {
                          <a
                            [routerLink]="banner.link"
                            class="inline-block bg-flipkart-yellow hover:bg-flipkart-yellow/90 text-flipkart-gray-900 font-semibold px-6 py-3 rounded-md transition-colors"
                          >
                            {{ banner.buttonText }}
                          </a>
                        }
                      </div>
                    </div>
                  </div>
                </div>
              }
            </div>
          }
        </div>
      </div>
    </section>

    <!-- Categories Section -->
    <section class="py-8 bg-white">
      <div class="container-custom">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Shop by Category</h2>
        <div class="grid grid-cols-3 md:grid-cols-6 gap-4">
          @for (category of categories(); track category.id) {
            <a
              [routerLink]="['/category', category.name.toLowerCase()]"
              class="group text-center p-4 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div class="text-4xl mb-2 group-hover:scale-110 transition-transform">{{ category.icon }}</div>
              <div class="text-sm font-medium text-gray-900">{{ category.name }}</div>
            </a>
          }
        </div>
      </div>
    </section>

    <!-- Featured Products -->
    <section class="py-12 bg-gray-50">
      <div class="container-custom">
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-2xl font-bold text-gray-900">Featured Products</h2>
          <a routerLink="/products" class="text-flipkart-blue hover:text-flipkart-blue/80 font-medium">
            View All →
          </a>
        </div>
        
        @if (loadingFeatured()) {
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            @for (item of [1,2,3,4,5,6,7,8]; track item) {
              <div class="bg-white rounded-lg shadow-product animate-pulse">
                <div class="aspect-square bg-gray-200 rounded-t-lg"></div>
                <div class="p-4">
                  <div class="h-4 bg-gray-200 rounded mb-2"></div>
                  <div class="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                  <div class="h-6 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            }
          </div>
        } @else {
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            @for (product of featuredProducts(); track product.id) {
              <app-product-card [product]="product" />
            }
          </div>
        }
      </div>
    </section>

    <!-- Trending Products -->
    <section class="py-12 bg-white">
      <div class="container-custom">
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-2xl font-bold text-gray-900">Trending Now</h2>
          <a routerLink="/trending" class="text-flipkart-blue hover:text-flipkart-blue/80 font-medium">
            View All →
          </a>
        </div>
        
        @if (loadingTrending()) {
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            @for (item of [1,2,3,4,5,6]; track item) {
              <div class="bg-white rounded-lg shadow-product animate-pulse">
                <div class="aspect-square bg-gray-200 rounded-t-lg"></div>
                <div class="p-4">
                  <div class="h-4 bg-gray-200 rounded mb-2"></div>
                  <div class="h-6 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            }
          </div>
        } @else {
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            @for (product of trendingProducts(); track product.id) {
              <app-product-card [product]="product" />
            }
          </div>
        }
      </div>
    </section>

    <!-- Special Offers -->
    <section class="py-12 bg-gradient-to-r from-flipkart-blue to-blue-600">
      <div class="container-custom">
        <div class="text-center text-white">
          <h2 class="text-3xl font-bold mb-4">Special Offers</h2>
          <p class="text-xl mb-8">Don't miss out on these amazing deals!</p>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
              <div class="text-4xl mb-4">🚚</div>
              <h3 class="text-xl font-semibold mb-2">Free Delivery</h3>
              <p class="text-white/90">On orders above ₹499</p>
            </div>
            <div class="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
              <div class="text-4xl mb-4">💰</div>
              <h3 class="text-xl font-semibold mb-2">Best Prices</h3>
              <p class="text-white/90">Guaranteed lowest prices</p>
            </div>
            <div class="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
              <div class="text-4xl mb-4">🔄</div>
              <h3 class="text-xl font-semibold mb-2">Easy Returns</h3>
              <p class="text-white/90">30-day return policy</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .container-custom {
      @apply w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
    }
  `]
})
export class HomeComponent implements OnInit {
  private productService = inject(ProductService);
  
  banners = signal<Banner[]>([]);
  categories = signal<Category[]>([]);
  featuredProducts = signal<Product[]>([]);
  trendingProducts = signal<Product[]>([]);
  currentBannerIndex = signal(0);
  loadingFeatured = signal(true);
  loadingTrending = signal(true);

  ngOnInit() {
    this.loadData();
  }

  private loadData() {
    // Load banners
    this.productService.getBanners().subscribe(banners => {
      this.banners.set(banners);
    });

    // Load categories
    this.productService.getCategories().subscribe(categories => {
      this.categories.set(categories);
    });

    // Load featured products
    this.productService.getFeaturedProducts().subscribe(products => {
      this.featuredProducts.set(products);
      this.loadingFeatured.set(false);
    });

    // Load trending products
    this.productService.getTrendingProducts().subscribe(products => {
      this.trendingProducts.set(products);
      this.loadingTrending.set(false);
    });
  }
}
