import { Component, Input, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { Product } from "../../models/product.model";

@Component({
  selector: "app-product-card",
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="product-card group cursor-pointer h-full flex flex-col">
      <!-- Product Image -->
      <div class="relative overflow-hidden bg-gray-50 aspect-square">
        <img
          [src]="product.images[0]"
          [alt]="product.title"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          (error)="onImageError($event)"
          loading="lazy"
        />

        <!-- Discount Badge -->
        @if (product.discount && product.discount > 0) {
          <div
            class="absolute top-2 left-2 bg-flipkart-green text-white text-xs font-semibold px-2 py-1 rounded"
          >
            {{ product.discount }}% off
          </div>
        }

        <!-- Wishlist Button -->
        <button
          (click)="toggleWishlist($event)"
          class="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-50"
          [class.text-red-500]="isInWishlist()"
          [class.text-gray-400]="!isInWishlist()"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>

      <!-- Product Info -->
      <div class="flex-1 p-3 flex flex-col">
        <!-- Brand -->
        <div
          class="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1"
        >
          {{ product.brand }}
        </div>

        <!-- Title -->
        <h3 class="text-sm font-medium text-gray-900 mb-2 line-clamp-2 flex-1">
          <a
            [routerLink]="['/product', product.id]"
            class="hover:text-flipkart-blue transition-colors"
          >
            {{ product.title }}
          </a>
        </h3>

        <!-- Rating -->
        <div class="flex items-center mb-2">
          <div class="flex items-center space-x-1">
            @for (star of [1, 2, 3, 4, 5]; track star) {
              <svg
                class="w-3 h-3"
                [class.text-flipkart-yellow]="star <= product.rating"
                [class.text-gray-300]="star > product.rating"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                />
              </svg>
            }
          </div>
          <span class="text-xs text-gray-500 ml-1"
            >({{ product.reviewCount }})</span
          >
        </div>

        <!-- Price -->
        <div class="flex items-center space-x-2 mb-3">
          <span class="text-lg font-bold text-gray-900">
            ₹{{ formatPrice(product.price) }}
          </span>
          @if (product.originalPrice && product.originalPrice > product.price) {
            <span class="text-sm text-gray-500 line-through">
              ₹{{ formatPrice(product.originalPrice) }}
            </span>
          }
        </div>

        <!-- Features -->
        @if (product.features && product.features.length > 0) {
          <div class="mb-3">
            <ul class="text-xs text-gray-600 space-y-1">
              @for (feature of product.features.slice(0, 2); track feature) {
                <li class="flex items-center">
                  <span class="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                  {{ feature }}
                </li>
              }
            </ul>
          </div>
        }

        <!-- Tags -->
        @if (product.tags && product.tags.length > 0) {
          <div class="flex flex-wrap gap-1 mb-3">
            @for (tag of product.tags.slice(0, 2); track tag) {
              <span
                class="text-xs bg-flipkart-blue text-white px-2 py-1 rounded"
              >
                {{ tag }}
              </span>
            }
          </div>
        }

        <!-- Free Delivery -->
        @if (product.freeDelivery) {
          <div
            class="flex items-center text-xs text-flipkart-green font-medium mb-3"
          >
            <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path
                d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
              />
              <path
                d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707L16 7.586A1 1 0 0015.414 7H14z"
              />
            </svg>
            Free Delivery
          </div>
        }

        <!-- Add to Cart Button -->
        <button
          (click)="addToCart($event)"
          [disabled]="!product.inStock"
          class="w-full btn-primary py-2 px-4 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed mt-auto"
          [class.bg-gray-400]="!product.inStock"
          [class.hover:bg-gray-400]="!product.inStock"
        >
          @if (product.inStock) {
            Add to Cart
          } @else {
            Out of Stock
          }
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .line-clamp-2 {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
    `,
  ],
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;

  private wishlistItems = signal<string[]>(["2", "5"]); // Mock wishlist items

  formatPrice(price: number): string {
    return price.toLocaleString("en-IN");
  }

  isInWishlist(): boolean {
    return this.wishlistItems().includes(this.product.id);
  }

  toggleWishlist(event: Event) {
    event.stopPropagation();
    event.preventDefault();

    const currentWishlist = this.wishlistItems();
    if (this.isInWishlist()) {
      this.wishlistItems.set(
        currentWishlist.filter((id) => id !== this.product.id),
      );
      console.log("Removed from wishlist:", this.product.title);
    } else {
      this.wishlistItems.set([...currentWishlist, this.product.id]);
      console.log("Added to wishlist:", this.product.title);
    }
  }

  addToCart(event: Event) {
    event.stopPropagation();
    event.preventDefault();

    if (this.product.inStock) {
      console.log("Added to cart:", this.product.title);
      // TODO: Implement cart service
    }
  }

  onImageError(event: any) {
    event.target.src = "https://via.placeholder.com/300x300?text=No+Image";
  }
}
