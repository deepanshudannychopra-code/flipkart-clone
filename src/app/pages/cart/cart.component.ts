import { Component, inject, computed } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { CartService } from "../../services/cart.service";
import { CartItem } from "../../models/product.model";

@Component({
  selector: "app-cart",
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50">
      <div class="container-custom py-6">
        <!-- Cart Header -->
        <div class="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div class="flex items-center justify-between">
            <h1 class="text-2xl font-bold text-gray-900">Shopping Cart</h1>
            @if (cartItems().length > 0) {
              <button
                (click)="clearCart()"
                class="text-flipkart-red hover:text-flipkart-red/80 text-sm font-medium"
              >
                Clear Cart
              </button>
            }
          </div>
          <p class="text-gray-600 mt-2">
            {{ cartItems().length }} item(s) in your cart
          </p>
        </div>

        @if (cartItems().length === 0) {
          <!-- Empty Cart -->
          <div class="bg-white rounded-lg shadow-sm border p-12 text-center">
            <div class="text-6xl mb-6">🛒</div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">
              Your cart is empty
            </h3>
            <p class="text-gray-600 mb-6">
              Looks like you haven't added anything to your cart yet. Start
              shopping now!
            </p>
            <a routerLink="/" class="btn-primary py-3 px-6">
              Continue Shopping
            </a>
          </div>
        } @else {
          <!-- Cart Items -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Items List -->
            <div class="lg:col-span-2 space-y-4">
              @for (item of cartItems(); track item.product.id) {
                <div class="bg-white rounded-lg shadow-sm border p-6">
                  <div class="flex items-start space-x-4">
                    <!-- Product Image -->
                    <div class="flex-shrink-0">
                      <img
                        [src]="item.product.images[0]"
                        [alt]="item.product.title"
                        class="w-24 h-24 object-cover rounded-lg"
                        (error)="onImageError($event)"
                      />
                    </div>

                    <!-- Product Details -->
                    <div class="flex-1 min-w-0">
                      <div class="flex items-start justify-between">
                        <div class="flex-1">
                          <h3 class="text-lg font-medium text-gray-900 mb-1">
                            <a
                              [routerLink]="['/product', item.product.id]"
                              class="hover:text-flipkart-blue"
                            >
                              {{ item.product.title }}
                            </a>
                          </h3>
                          <p class="text-sm text-gray-500 mb-2">
                            {{ item.product.brand }}
                          </p>

                          <!-- Rating -->
                          <div class="flex items-center mb-2">
                            <div class="flex items-center">
                              @for (star of [1, 2, 3, 4, 5]; track star) {
                                <svg
                                  class="w-4 h-4"
                                  [class.text-flipkart-yellow]="
                                    star <= item.product.rating
                                  "
                                  [class.text-gray-300]="
                                    star > item.product.rating
                                  "
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                                  />
                                </svg>
                              }
                            </div>
                            <span class="text-sm text-gray-500 ml-1"
                              >({{ item.product.reviewCount }})</span
                            >
                          </div>

                          <!-- Price -->
                          <div class="flex items-center space-x-2 mb-4">
                            <span class="text-xl font-bold text-gray-900">
                              ₹{{ formatPrice(item.product.price) }}
                            </span>
                            @if (
                              item.product.originalPrice &&
                              item.product.originalPrice > item.product.price
                            ) {
                              <span class="text-sm text-gray-500 line-through">
                                ₹{{ formatPrice(item.product.originalPrice) }}
                              </span>
                              <span
                                class="text-sm text-flipkart-green font-medium"
                              >
                                {{ item.product.discount }}% off
                              </span>
                            }
                          </div>

                          <!-- Free Delivery -->
                          @if (item.product.freeDelivery) {
                            <div
                              class="flex items-center text-sm text-flipkart-green font-medium mb-4"
                            >
                              <svg
                                class="w-4 h-4 mr-1"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
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
                        </div>

                        <!-- Remove Button -->
                        <button
                          (click)="removeFromCart(item.product.id)"
                          class="text-gray-400 hover:text-flipkart-red p-2"
                          title="Remove from cart"
                        >
                          <svg
                            class="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clip-rule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>

                      <!-- Quantity Controls -->
                      <div class="flex items-center justify-between mt-4">
                        <div class="flex items-center space-x-3">
                          <span class="text-sm font-medium text-gray-700"
                            >Quantity:</span
                          >
                          <div
                            class="flex items-center border border-gray-300 rounded"
                          >
                            <button
                              (click)="
                                updateQuantity(
                                  item.product.id,
                                  item.quantity - 1
                                )
                              "
                              [disabled]="item.quantity <= 1"
                              class="px-3 py-1 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              -
                            </button>
                            <span
                              class="px-4 py-1 border-x border-gray-300 bg-gray-50"
                              >{{ item.quantity }}</span
                            >
                            <button
                              (click)="
                                updateQuantity(
                                  item.product.id,
                                  item.quantity + 1
                                )
                              "
                              class="px-3 py-1 text-gray-600 hover:text-gray-800"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div class="text-lg font-semibold text-gray-900">
                          ₹{{ formatPrice(item.product.price * item.quantity) }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              }
            </div>

            <!-- Order Summary -->
            <div class="lg:col-span-1">
              <div
                class="bg-white rounded-lg shadow-sm border p-6 sticky top-6"
              >
                <h3 class="text-lg font-semibold text-gray-900 mb-4">
                  Order Summary
                </h3>

                <div class="space-y-3 mb-6">
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-600"
                      >Subtotal ({{ totalItems() }} items)</span
                    >
                    <span class="font-medium"
                      >₹{{ formatPrice(cartService.getSubtotal()) }}</span
                    >
                  </div>

                  @if (cartService.totalSavings() > 0) {
                    <div
                      class="flex justify-between text-sm text-flipkart-green"
                    >
                      <span>Savings</span>
                      <span
                        >-₹{{ formatPrice(cartService.totalSavings()) }}</span
                      >
                    </div>
                  }

                  <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Delivery Charges</span>
                    <span
                      [class.text-flipkart-green]="
                        cartService.getDeliveryCharge() === 0
                      "
                      class="font-medium"
                    >
                      @if (cartService.getDeliveryCharge() === 0) {
                        FREE
                      } @else {
                        ₹{{ cartService.getDeliveryCharge() }}
                      }
                    </span>
                  </div>

                  <hr class="my-3" />

                  <div class="flex justify-between font-semibold text-lg">
                    <span>Total Amount</span>
                    <span
                      >₹{{ formatPrice(cartService.getTotalAmount()) }}</span
                    >
                  </div>
                </div>

                <!-- Free Delivery Message -->
                <div
                  class="bg-flipkart-green/10 border border-flipkart-green/20 rounded-lg p-3 mb-4"
                >
                  <p class="text-sm text-flipkart-green font-medium">
                    {{ cartService.getFreeDeliveryMessage() }}
                  </p>
                </div>

                <!-- Action Buttons -->
                <div class="space-y-3">
                  <a
                    routerLink="/checkout"
                    class="btn-primary w-full py-3 text-center block"
                  >
                    Proceed to Checkout
                  </a>
                  <a
                    routerLink="/"
                    class="btn-outline w-full py-3 text-center block"
                  >
                    Continue Shopping
                  </a>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .container-custom {
        @apply w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
      }
    `,
  ],
})
export class CartComponent {
  cartService = inject(CartService);

  cartItems = this.cartService.items;
  totalItems = computed(() => this.cartService.itemCount());

  formatPrice(price: number): string {
    return price.toLocaleString("en-IN");
  }

  updateQuantity(productId: string, quantity: number) {
    this.cartService.updateQuantity(productId, quantity);
  }

  removeFromCart(productId: string) {
    this.cartService.removeFromCart(productId);
  }

  clearCart() {
    if (confirm("Are you sure you want to clear your cart?")) {
      this.cartService.clearCart();
    }
  }

  onImageError(event: any) {
    event.target.src = "https://via.placeholder.com/300x300?text=No+Image";
  }
}
