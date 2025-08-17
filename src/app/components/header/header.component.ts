import { Component, signal, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink, RouterLinkActive, Router } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { ProductService } from "../../services/product.service";
import { CartService } from "../../services/cart.service";
import { AuthService } from "../../services/auth.service";
import { LocationService } from "../../services/location.service";
import { LocationPickerComponent } from "../location-picker/location-picker.component";
import { Category } from "../../models/product.model";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, FormsModule, LocationPickerComponent],
  template: `
    <!-- Top Header -->
    <div class="bg-flipkart-blue text-white">
      <div class="container-custom">
        <div class="flex items-center justify-between py-2 text-sm">
          <div class="flex items-center space-x-6">
            <span class="flex items-center">
              <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clip-rule="evenodd"
                />
              </svg>
              Deliver to:
              <button
                (click)="showLocationPicker.set(true)"
                class="ml-1 font-bold hover:underline focus:outline-none"
              >
                {{ locationService.location().displayName }}
              </button>
            </span>
          </div>
          <div class="flex items-center space-x-6">
            <a href="#" class="hover:underline">Become a Seller</a>
            <a href="#" class="hover:underline">More</a>
            <div class="flex items-center space-x-2">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clip-rule="evenodd"
                />
              </svg>
              <span>Customer Care</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Header -->
    <div class="bg-white shadow-sm border-b">
      <div class="container-custom">
        <div class="flex items-center justify-between py-3">
          <!-- Logo -->
          <div class="flex items-center">
            <a routerLink="/" class="flex items-center">
              <div class="text-2xl font-bold text-flipkart-blue mr-8">
                <span
                  class="bg-flipkart-blue text-white px-2 py-1 rounded italic"
                  >F</span
                >lipkart
                <div class="text-xs text-flipkart-yellow font-normal italic">
                  Explore <span class="text-flipkart-blue">Plus</span>
                </div>
              </div>
            </a>
          </div>

          <!-- Search Bar -->
          <div class="flex-1 max-w-2xl mx-8">
            <div class="relative">
              <input
                type="text"
                [(ngModel)]="searchQuery"
                (keyup.enter)="onSearch()"
                placeholder="Search for products, brands and more"
                class="w-full pl-4 pr-12 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-flipkart-blue"
              />
              <button
                (click)="onSearch()"
                class="absolute right-0 top-0 h-full px-4 bg-flipkart-yellow hover:bg-flipkart-yellow/90 transition-colors"
              >
                <svg
                  class="w-5 h-5 text-flipkart-blue"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>

          <!-- User Actions -->
          <div class="flex items-center space-x-6">
            <!-- Login/User Profile -->
            @if (authService.loggedIn()) {
              <div class="relative">
                <button
                  (click)="showUserMenu.set(!showUserMenu())"
                  class="flex items-center space-x-2 text-flipkart-blue font-medium hover:text-flipkart-blue/80"
                >
                  <img
                    [src]="
                      authService.user()?.avatar ||
                      'https://ui-avatars.com/api/?name=User&background=2874f0&color=fff'
                    "
                    [alt]="authService.user()?.name"
                    class="w-6 h-6 rounded-full"
                  />
                  <span>{{ authService.user()?.name }}</span>
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>

                @if (showUserMenu()) {
                  <div
                    class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-50"
                  >
                    <div class="py-1">
                      <a
                        href="#"
                        class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >My Profile</a
                      >
                      <a
                        href="#"
                        class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >Orders</a
                      >
                      <a
                        href="#"
                        class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >Coupons</a
                      >
                      <hr class="my-1" />
                      <button
                        (click)="logout()"
                        class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                }
              </div>
            } @else {
              <a
                routerLink="/login"
                class="flex items-center space-x-1 text-flipkart-blue font-medium hover:text-flipkart-blue/80"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span>Login</span>
              </a>
            }

            <!-- Wishlist -->
            <a
              routerLink="/wishlist"
              class="flex items-center space-x-1 text-gray-700 hover:text-flipkart-blue relative"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  clip-rule="evenodd"
                />
              </svg>
              <span>Wishlist</span>
              @if (wishlistCount() > 0) {
                <span
                  class="absolute -top-2 -right-2 bg-flipkart-red text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                >
                  {{ wishlistCount() }}
                </span>
              }
            </a>

            <!-- Cart -->
            <a
              routerLink="/cart"
              class="flex items-center space-x-1 text-gray-700 hover:text-flipkart-blue relative"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"
                />
              </svg>
              <span>Cart</span>
              @if (cartCount() > 0) {
                <span
                  class="absolute -top-2 -right-2 bg-flipkart-red text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                >
                  {{ cartCount() }}
                </span>
              }
            </a>

            <!-- More Menu -->
            <div class="relative">
              <button
                (click)="showMoreMenu.set(!showMoreMenu())"
                class="flex items-center space-x-1 text-gray-700 hover:text-flipkart-blue"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"
                  />
                </svg>
                <span>More</span>
              </button>

              @if (showMoreMenu()) {
                <div
                  class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-50"
                >
                  <div class="py-1">
                    <a
                      href="#"
                      class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >My Profile</a
                    >
                    <a
                      href="#"
                      class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >Orders</a
                    >
                    <a
                      href="#"
                      class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >Coupons</a
                    >
                    <a
                      href="#"
                      class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >Gift Cards</a
                    >
                    <a
                      href="#"
                      class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >Notifications</a
                    >
                    <a
                      href="#"
                      class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >Help Center</a
                    >
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Category Navigation -->
    <div class="bg-white border-b">
      <div class="container-custom">
        <div class="flex items-center space-x-8 py-2 overflow-x-auto">
          @for (category of categories(); track category.id) {
            <a
              [routerLink]="['/category', category.name.toLowerCase()]"
              routerLinkActive="text-flipkart-blue font-semibold"
              class="flex items-center space-x-2 text-gray-700 hover:text-flipkart-blue whitespace-nowrap text-sm py-2 transition-colors"
            >
              <span class="text-lg">{{ category.icon }}</span>
              <span>{{ category.name }}</span>
            </a>
          }
        </div>
      </div>
    </div>

    <!-- Location Picker Modal -->
    @if (showLocationPicker()) {
      <app-location-picker
        (close)="showLocationPicker.set(false)"
        (locationSelected)="onLocationSelected($event)"
      ></app-location-picker>
    }
  `,
  styles: [
    `
      .container-custom {
        @apply w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
      }
    `,
  ],
})
export class HeaderComponent {
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  authService = inject(AuthService);
  private router = inject(Router);

  searchQuery = signal("");
  showMoreMenu = signal(false);
  categories = signal<Category[]>([]);
  cartCount = this.cartService.itemCount;
  wishlistCount = signal(5); // Mock wishlist count
  showUserMenu = signal(false);

  constructor() {
    this.loadCategories();
  }

  private loadCategories() {
    this.productService.getCategories().subscribe((categories) => {
      this.categories.set(categories);
    });
  }

  onSearch() {
    const query = this.searchQuery();
    if (query.trim()) {
      this.router.navigate(["/search"], { queryParams: { q: query } });
    }
  }

  logout() {
    this.authService.logout();
    this.showUserMenu.set(false);
    this.router.navigate(["/"]);
  }
}
