import { Component, signal, inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink, ActivatedRoute, Router } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { ProductService } from "../../services/product.service";
import { ProductCardComponent } from "../../components/product-card/product-card.component";
import { Product, Category } from "../../models/product.model";

@Component({
  selector: "app-search",
  standalone: true,
  imports: [CommonModule, RouterLink, ProductCardComponent, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <div class="container-custom py-6">
        <!-- Search Header -->
        <div class="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div class="flex items-center justify-between mb-4">
            <h1 class="text-2xl font-bold text-gray-900">Search Results</h1>
            <div class="flex items-center space-x-4">
              <div class="relative">
                <input
                  type="text"
                  [(ngModel)]="searchQuery"
                  (keyup.enter)="performSearch()"
                  placeholder="Search for products..."
                  class="w-64 pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-flipkart-blue"
                />
                <button
                  (click)="performSearch()"
                  class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-flipkart-blue"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          @if (currentSearchQuery()) {
            <div class="flex items-center justify-between">
              <p class="text-gray-600">
                {{ searchResults().length }} results found for "<strong>{{
                  currentSearchQuery()
                }}</strong
                >"
              </p>
              <button
                (click)="clearSearch()"
                class="text-flipkart-blue hover:text-flipkart-blue/80 text-sm"
              >
                Clear Search
              </button>
            </div>
          }
        </div>

        <!-- Filters Sidebar & Results -->
        <div class="flex gap-6">
          <!-- Filters Sidebar -->
          <div class="w-64 flex-shrink-0">
            <div class="bg-white rounded-lg shadow-sm border p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Filters</h3>

              <!-- Categories Filter -->
              <div class="mb-6">
                <h4 class="font-medium text-gray-900 mb-3">Categories</h4>
                <div class="space-y-2">
                  <label class="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value=""
                      [checked]="selectedCategory() === ''"
                      (change)="onCategoryChange('')"
                      class="form-radio text-flipkart-blue"
                    />
                    <span class="ml-2 text-sm text-gray-700"
                      >All Categories</span
                    >
                  </label>
                  @for (category of categories(); track category.id) {
                    <label class="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        [value]="category.name"
                        [checked]="selectedCategory() === category.name"
                        (change)="onCategoryChange(category.name)"
                        class="form-radio text-flipkart-blue"
                      />
                      <span class="ml-2 text-sm text-gray-700">{{
                        category.name
                      }}</span>
                    </label>
                  }
                </div>
              </div>

              <!-- Price Filter -->
              <div class="mb-6">
                <h4 class="font-medium text-gray-900 mb-3">Price Range</h4>
                <div class="space-y-2">
                  <label class="flex items-center">
                    <input
                      type="radio"
                      name="priceRange"
                      value=""
                      [checked]="selectedPriceRange() === ''"
                      (change)="onPriceRangeChange('')"
                      class="form-radio text-flipkart-blue"
                    />
                    <span class="ml-2 text-sm text-gray-700">Any Price</span>
                  </label>
                  <label class="flex items-center">
                    <input
                      type="radio"
                      name="priceRange"
                      value="0-1000"
                      [checked]="selectedPriceRange() === '0-1000'"
                      (change)="onPriceRangeChange('0-1000')"
                      class="form-radio text-flipkart-blue"
                    />
                    <span class="ml-2 text-sm text-gray-700">Under ₹1,000</span>
                  </label>
                  <label class="flex items-center">
                    <input
                      type="radio"
                      name="priceRange"
                      value="1000-5000"
                      [checked]="selectedPriceRange() === '1000-5000'"
                      (change)="onPriceRangeChange('1000-5000')"
                      class="form-radio text-flipkart-blue"
                    />
                    <span class="ml-2 text-sm text-gray-700"
                      >₹1,000 - ₹5,000</span
                    >
                  </label>
                  <label class="flex items-center">
                    <input
                      type="radio"
                      name="priceRange"
                      value="5000-20000"
                      [checked]="selectedPriceRange() === '5000-20000'"
                      (change)="onPriceRangeChange('5000-20000')"
                      class="form-radio text-flipkart-blue"
                    />
                    <span class="ml-2 text-sm text-gray-700"
                      >₹5,000 - ₹20,000</span
                    >
                  </label>
                  <label class="flex items-center">
                    <input
                      type="radio"
                      name="priceRange"
                      value="20000-99999999"
                      [checked]="selectedPriceRange() === '20000-99999999'"
                      (change)="onPriceRangeChange('20000-99999999')"
                      class="form-radio text-flipkart-blue"
                    />
                    <span class="ml-2 text-sm text-gray-700"
                      >Above ₹20,000</span
                    >
                  </label>
                </div>
              </div>

              <!-- Rating Filter -->
              <div class="mb-6">
                <h4 class="font-medium text-gray-900 mb-3">Customer Rating</h4>
                <div class="space-y-2">
                  @for (rating of [4, 3, 2, 1]; track rating) {
                    <label class="flex items-center">
                      <input
                        type="radio"
                        name="rating"
                        [value]="rating"
                        [checked]="selectedRating() === rating"
                        (change)="onRatingChange(rating)"
                        class="form-radio text-flipkart-blue"
                      />
                      <span
                        class="ml-2 flex items-center text-sm text-gray-700"
                      >
                        {{ rating }}⭐ & above
                      </span>
                    </label>
                  }
                </div>
              </div>

              <button
                (click)="clearAllFilters()"
                class="w-full btn-outline py-2 px-4 text-sm"
              >
                Clear All Filters
              </button>
            </div>
          </div>

          <!-- Search Results -->
          <div class="flex-1">
            @if (loading()) {
              <div
                class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
              >
                @for (item of [1, 2, 3, 4, 5, 6, 7, 8]; track item) {
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
            } @else if (searchResults().length === 0 && currentSearchQuery()) {
              <div class="text-center py-12">
                <div class="text-6xl mb-6">🔍</div>
                <h3 class="text-xl font-semibold text-gray-900 mb-2">
                  No products found
                </h3>
                <p class="text-gray-600 mb-6">
                  Try adjusting your search or filters to find what you're
                  looking for.
                </p>
                <button (click)="clearSearch()" class="btn-primary py-2 px-6">
                  Browse All Products
                </button>
              </div>
            } @else {
              <div
                class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
              >
                @for (product of searchResults(); track product.id) {
                  <app-product-card [product]="product" />
                }
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .container-custom {
        @apply w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
      }
      .form-radio {
        @apply h-4 w-4;
      }
    `,
  ],
})
export class SearchComponent implements OnInit {
  private productService = inject(ProductService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  searchQuery = signal("");
  currentSearchQuery = signal("");
  searchResults = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  selectedCategory = signal("");
  selectedPriceRange = signal("");
  selectedRating = signal<number | null>(null);
  loading = signal(false);

  ngOnInit() {
    this.loadCategories();

    // Get search query from route params
    this.route.queryParams.subscribe((params) => {
      const query = params["q"] || "";
      if (query) {
        this.searchQuery.set(query);
        this.currentSearchQuery.set(query);
        this.performSearch();
      } else {
        this.loadAllProducts();
      }
    });
  }

  private loadCategories() {
    this.productService.getCategories().subscribe((categories) => {
      this.categories.set(categories);
    });
  }

  private loadAllProducts() {
    this.loading.set(true);
    this.productService.getAllProducts().subscribe((products) => {
      this.searchResults.set(products);
      this.loading.set(false);
    });
  }

  performSearch() {
    const query = this.searchQuery().trim();
    if (query) {
      this.currentSearchQuery.set(query);
      this.router.navigate(["/search"], { queryParams: { q: query } });
      this.executeSearch();
    }
  }

  private executeSearch() {
    this.loading.set(true);
    const query = this.currentSearchQuery();

    this.productService.searchProducts(query).subscribe((products) => {
      let filtered = products;

      // Apply category filter
      if (this.selectedCategory()) {
        filtered = filtered.filter(
          (p) => p.category === this.selectedCategory(),
        );
      }

      // Apply price range filter
      if (this.selectedPriceRange()) {
        const [min, max] = this.selectedPriceRange().split("-").map(Number);
        filtered = filtered.filter((p) => p.price >= min && p.price <= max);
      }

      // Apply rating filter
      if (this.selectedRating()) {
        filtered = filtered.filter((p) => p.rating >= this.selectedRating()!);
      }

      this.searchResults.set(filtered);
      this.loading.set(false);
    });
  }

  onCategoryChange(category: string) {
    this.selectedCategory.set(category);
    this.applyFilters();
  }

  onPriceRangeChange(range: string) {
    this.selectedPriceRange.set(range);
    this.applyFilters();
  }

  onRatingChange(rating: number) {
    this.selectedRating.set(this.selectedRating() === rating ? null : rating);
    this.applyFilters();
  }

  private applyFilters() {
    if (this.currentSearchQuery()) {
      this.executeSearch();
    } else {
      this.loadAllProducts();
    }
  }

  clearSearch() {
    this.searchQuery.set("");
    this.currentSearchQuery.set("");
    this.router.navigate(["/search"]);
    this.loadAllProducts();
  }

  clearAllFilters() {
    this.selectedCategory.set("");
    this.selectedPriceRange.set("");
    this.selectedRating.set(null);
    this.applyFilters();
  }
}
