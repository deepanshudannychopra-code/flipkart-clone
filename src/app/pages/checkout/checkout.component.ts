import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <div class="container-custom py-6">
        <!-- Checkout Header -->
        <div class="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h1 class="text-2xl font-bold text-gray-900">Checkout</h1>
          <p class="text-gray-600 mt-2">Review your order and complete your purchase</p>
        </div>

        @if (cartItems().length === 0) {
          <!-- Empty Cart Redirect -->
          <div class="bg-white rounded-lg shadow-sm border p-12 text-center">
            <div class="text-6xl mb-6">🛒</div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
            <p class="text-gray-600 mb-6">
              Add some items to your cart before proceeding to checkout.
            </p>
            <a routerLink="/" class="btn-primary py-3 px-6">
              Continue Shopping
            </a>
          </div>
        } @else {
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Checkout Form -->
            <div class="space-y-6">
              <!-- Delivery Address -->
              <div class="bg-white rounded-lg shadow-sm border p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Delivery Address</h3>
                
                @if (!authService.loggedIn()) {
                  <div class="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p class="text-sm text-yellow-800">
                      Please <a routerLink="/login" class="text-flipkart-blue hover:underline">login</a> 
                      to save your address for future orders.
                    </p>
                  </div>
                }

                <form [formGroup]="addressForm">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Full Name</label>
                      <input
                        type="text"
                        formControlName="fullName"
                        class="mt-1 input w-full"
                        [class.border-red-500]="addressForm.get('fullName')?.invalid && addressForm.get('fullName')?.touched"
                        placeholder="Enter full name"
                      >
                      @if (addressForm.get('fullName')?.invalid && addressForm.get('fullName')?.touched) {
                        <p class="mt-1 text-sm text-red-600">Full name is required</p>
                      }
                    </div>
                    
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Phone Number</label>
                      <input
                        type="tel"
                        formControlName="phone"
                        class="mt-1 input w-full"
                        [class.border-red-500]="addressForm.get('phone')?.invalid && addressForm.get('phone')?.touched"
                        placeholder="Enter phone number"
                      >
                      @if (addressForm.get('phone')?.invalid && addressForm.get('phone')?.touched) {
                        <p class="mt-1 text-sm text-red-600">Phone number is required</p>
                      }
                    </div>
                  </div>

                  <div class="mt-4">
                    <label class="block text-sm font-medium text-gray-700">Address</label>
                    <textarea
                      formControlName="address"
                      rows="3"
                      class="mt-1 input w-full"
                      [class.border-red-500]="addressForm.get('address')?.invalid && addressForm.get('address')?.touched"
                      placeholder="Enter your complete address"
                    ></textarea>
                    @if (addressForm.get('address')?.invalid && addressForm.get('address')?.touched) {
                      <p class="mt-1 text-sm text-red-600">Address is required</p>
                    }
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700">City</label>
                      <input
                        type="text"
                        formControlName="city"
                        class="mt-1 input w-full"
                        [class.border-red-500]="addressForm.get('city')?.invalid && addressForm.get('city')?.touched"
                        placeholder="Enter city"
                      >
                      @if (addressForm.get('city')?.invalid && addressForm.get('city')?.touched) {
                        <p class="mt-1 text-sm text-red-600">City is required</p>
                      }
                    </div>
                    
                    <div>
                      <label class="block text-sm font-medium text-gray-700">State</label>
                      <input
                        type="text"
                        formControlName="state"
                        class="mt-1 input w-full"
                        [class.border-red-500]="addressForm.get('state')?.invalid && addressForm.get('state')?.touched"
                        placeholder="Enter state"
                      >
                      @if (addressForm.get('state')?.invalid && addressForm.get('state')?.touched) {
                        <p class="mt-1 text-sm text-red-600">State is required</p>
                      }
                    </div>
                    
                    <div>
                      <label class="block text-sm font-medium text-gray-700">PIN Code</label>
                      <input
                        type="text"
                        formControlName="pincode"
                        class="mt-1 input w-full"
                        [class.border-red-500]="addressForm.get('pincode')?.invalid && addressForm.get('pincode')?.touched"
                        placeholder="Enter PIN code"
                      >
                      @if (addressForm.get('pincode')?.invalid && addressForm.get('pincode')?.touched) {
                        <p class="mt-1 text-sm text-red-600">
                          @if (addressForm.get('pincode')?.errors?.['required']) {
                            PIN code is required
                          }
                          @if (addressForm.get('pincode')?.errors?.['pattern']) {
                            Please enter a valid 6-digit PIN code
                          }
                        </p>
                      }
                    </div>
                  </div>
                </form>
              </div>

              <!-- Payment Method -->
              <div class="bg-white rounded-lg shadow-sm border p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Payment Method</h3>
                
                <div class="space-y-3">
                  <label class="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      [(ngModel)]="selectedPaymentMethod"
                      class="form-radio text-flipkart-blue"
                    >
                    <span class="ml-3 flex items-center">
                      <span class="text-2xl mr-2">💵</span>
                      <div>
                        <div class="font-medium">Cash on Delivery</div>
                        <div class="text-sm text-gray-500">Pay when your order arrives</div>
                      </div>
                    </span>
                  </label>
                  
                  <label class="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      [(ngModel)]="selectedPaymentMethod"
                      class="form-radio text-flipkart-blue"
                    >
                    <span class="ml-3 flex items-center">
                      <span class="text-2xl mr-2">💳</span>
                      <div>
                        <div class="font-medium">Credit/Debit Card</div>
                        <div class="text-sm text-gray-500">Secure payment with your card</div>
                      </div>
                    </span>
                  </label>
                  
                  <label class="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="upi"
                      [(ngModel)]="selectedPaymentMethod"
                      class="form-radio text-flipkart-blue"
                    >
                    <span class="ml-3 flex items-center">
                      <span class="text-2xl mr-2">📱</span>
                      <div>
                        <div class="font-medium">UPI</div>
                        <div class="text-sm text-gray-500">Pay using UPI apps</div>
                      </div>
                    </span>
                  </label>
                  
                  <label class="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="netbanking"
                      [(ngModel)]="selectedPaymentMethod"
                      class="form-radio text-flipkart-blue"
                    >
                    <span class="ml-3 flex items-center">
                      <span class="text-2xl mr-2">🏦</span>
                      <div>
                        <div class="font-medium">Net Banking</div>
                        <div class="text-sm text-gray-500">Pay through your bank account</div>
                      </div>
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <!-- Order Summary -->
            <div class="lg:col-span-1">
              <div class="bg-white rounded-lg shadow-sm border p-6 sticky top-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
                
                <!-- Items List -->
                <div class="space-y-4 mb-6">
                  @for (item of cartItems(); track item.product.id) {
                    <div class="flex items-center space-x-3">
                      <img
                        [src]="item.product.images[0]"
                        [alt]="item.product.title"
                        class="w-16 h-16 object-cover rounded-lg"
                        (error)="onImageError($event)"
                      >
                      <div class="flex-1 min-w-0">
                        <h4 class="text-sm font-medium text-gray-900 truncate">{{ item.product.title }}</h4>
                        <p class="text-sm text-gray-500">Qty: {{ item.quantity }}</p>
                        <p class="text-sm font-semibold text-gray-900">₹{{ formatPrice(item.product.price * item.quantity) }}</p>
                      </div>
                    </div>
                  }
                </div>

                <hr class="my-4">

                <!-- Pricing Details -->
                <div class="space-y-3 mb-6">
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Subtotal ({{ totalItems() }} items)</span>
                    <span class="font-medium">₹{{ formatPrice(cartService.getSubtotal()) }}</span>
                  </div>
                  
                  @if (cartService.getTotalSavings() > 0) {
                    <div class="flex justify-between text-sm text-flipkart-green">
                      <span>Savings</span>
                      <span>-₹{{ formatPrice(cartService.getTotalSavings()) }}</span>
                    </div>
                  }
                  
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Delivery Charges</span>
                    <span [class.text-flipkart-green]="cartService.getDeliveryCharge() === 0" class="font-medium">
                      @if (cartService.getDeliveryCharge() === 0) {
                        FREE
                      } @else {
                        ₹{{ cartService.getDeliveryCharge() }}
                      }
                    </span>
                  </div>
                  
                  <hr class="my-3">
                  
                  <div class="flex justify-between font-semibold text-lg">
                    <span>Total Amount</span>
                    <span>₹{{ formatPrice(cartService.getTotalAmount()) }}</span>
                  </div>
                </div>

                <!-- Free Delivery Message -->
                @if (cartService.getDeliveryCharge() === 0) {
                  <div class="bg-flipkart-green/10 border border-flipkart-green/20 rounded-lg p-3 mb-4">
                    <p class="text-sm text-flipkart-green font-medium">
                      🎉 You get FREE delivery on this order!
                    </p>
                  </div>
                }

                <!-- Action Buttons -->
                <div class="space-y-3">
                  <button
                    (click)="placeOrder()"
                    [disabled]="addressForm.invalid || !selectedPaymentMethod() || loading()"
                    class="btn-primary w-full py-3 text-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    @if (loading()) {
                      <span class="flex items-center justify-center">
                        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </span>
                    } @else {
                      @if (selectedPaymentMethod() === 'cod') {
                        Place Order (Cash on Delivery)
                      } @else {
                        Proceed to Payment
                      }
                    }
                  </button>
                  <a routerLink="/cart" class="btn-outline w-full py-3 text-center block">
                    Back to Cart
                  </a>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .container-custom {
      @apply w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
    }
    .form-radio {
      @apply h-4 w-4;
    }
  `]
})
export class CheckoutComponent {
  cartService = inject(CartService);
  authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  addressForm: FormGroup;
  selectedPaymentMethod = signal('cod');
  loading = signal(false);
  
  cartItems = this.cartService.items;
  totalItems = computed(() => this.cartService.itemCount());

  constructor() {
    this.addressForm = this.fb.group({
      fullName: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern(/^[\+]?[1-9][\d]{0,15}$/)]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      pincode: ['', [Validators.required, Validators.pattern(/^[1-9][0-9]{5}$/)]]
    });

    // Pre-fill form if user is logged in
    if (this.authService.loggedIn()) {
      const user = this.authService.user();
      if (user) {
        this.addressForm.patchValue({
          fullName: user.name,
          phone: user.phone || ''
        });
      }
    }
  }

  formatPrice(price: number): string {
    return price.toLocaleString('en-IN');
  }

  onImageError(event: any) {
    event.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
  }

  placeOrder() {
    if (this.addressForm.valid && this.selectedPaymentMethod()) {
      this.loading.set(true);

      const orderData = {
        items: this.cartItems(),
        address: this.addressForm.value,
        paymentMethod: this.selectedPaymentMethod(),
        totalAmount: this.cartService.getTotalAmount(),
        orderDate: new Date().toISOString()
      };

      // Simulate order processing
      setTimeout(() => {
        this.loading.set(false);
        
        if (this.selectedPaymentMethod() === 'cod') {
          // For COD, complete the order
          this.completeOrder(orderData);
        } else {
          // For other payment methods, redirect to payment page
          this.router.navigate(['/payment'], { 
            state: { orderData } 
          });
        }
      }, 2000);
    }
  }

  private completeOrder(orderData: any) {
    // Save order (in real app, this would be an API call)
    console.log('Order placed:', orderData);
    
    // Clear cart
    this.cartService.clearCart();
    
    // Redirect to success page (we'll create this)
    alert('Order placed successfully! You will receive a confirmation email shortly.');
    this.router.navigate(['/']);
  }
}
