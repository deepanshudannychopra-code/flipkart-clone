import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <div class="container-custom py-6">
        <!-- Payment Header -->
        <div class="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-2xl font-bold text-gray-900">Complete Payment</h1>
              <p class="text-gray-600 mt-2">Secure payment gateway</p>
            </div>
            <div class="flex items-center space-x-2 text-green-600">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"/>
              </svg>
              <span class="text-sm font-medium">Secure Payment</span>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Payment Form -->
          <div class="space-y-6">
            <!-- Payment Method Selection -->
            <div class="bg-white rounded-lg shadow-sm border p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Choose Payment Method</h3>
              
              <div class="space-y-3">
                <label class="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50" 
                       [class.border-flipkart-blue]="selectedMethod() === 'card'"
                       [class.bg-blue-50]="selectedMethod() === 'card'">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    [(ngModel)]="selectedMethod"
                    class="form-radio text-flipkart-blue"
                  >
                  <span class="ml-3 flex items-center flex-1">
                    <span class="text-2xl mr-3">💳</span>
                    <div>
                      <div class="font-medium">Credit/Debit Card</div>
                      <div class="text-sm text-gray-500">Visa, Mastercard, Rupay</div>
                    </div>
                  </span>
                </label>
                
                <label class="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
                       [class.border-flipkart-blue]="selectedMethod() === 'upi'"
                       [class.bg-blue-50]="selectedMethod() === 'upi'">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="upi"
                    [(ngModel)]="selectedMethod"
                    class="form-radio text-flipkart-blue"
                  >
                  <span class="ml-3 flex items-center flex-1">
                    <span class="text-2xl mr-3">📱</span>
                    <div>
                      <div class="font-medium">UPI</div>
                      <div class="text-sm text-gray-500">GooglePay, PhonePe, Paytm, BHIM</div>
                    </div>
                  </span>
                </label>
                
                <label class="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
                       [class.border-flipkart-blue]="selectedMethod() === 'netbanking'"
                       [class.bg-blue-50]="selectedMethod() === 'netbanking'">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="netbanking"
                    [(ngModel)]="selectedMethod"
                    class="form-radio text-flipkart-blue"
                  >
                  <span class="ml-3 flex items-center flex-1">
                    <span class="text-2xl mr-3">🏦</span>
                    <div>
                      <div class="font-medium">Net Banking</div>
                      <div class="text-sm text-gray-500">All major banks supported</div>
                    </div>
                  </span>
                </label>

                <label class="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
                       [class.border-flipkart-blue]="selectedMethod() === 'wallet'"
                       [class.bg-blue-50]="selectedMethod() === 'wallet'">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="wallet"
                    [(ngModel)]="selectedMethod"
                    class="form-radio text-flipkart-blue"
                  >
                  <span class="ml-3 flex items-center flex-1">
                    <span class="text-2xl mr-3">👛</span>
                    <div>
                      <div class="font-medium">Wallets</div>
                      <div class="text-sm text-gray-500">Paytm, MobiKwik, Amazon Pay</div>
                    </div>
                  </span>
                </label>
              </div>
            </div>

            <!-- Card Payment Form -->
            @if (selectedMethod() === 'card') {
              <div class="bg-white rounded-lg shadow-sm border p-6">
                <h4 class="font-semibold text-gray-900 mb-4">Enter Card Details</h4>
                
                <form [formGroup]="cardForm" class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Card Number</label>
                    <input
                      type="text"
                      formControlName="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      maxlength="19"
                      class="mt-1 input w-full"
                      [class.border-red-500]="cardForm.get('cardNumber')?.invalid && cardForm.get('cardNumber')?.touched"
                      (input)="formatCardNumber($event)"
                    >
                    @if (cardForm.get('cardNumber')?.invalid && cardForm.get('cardNumber')?.touched) {
                      <p class="mt-1 text-sm text-red-600">Please enter a valid card number</p>
                    }
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700">Cardholder Name</label>
                    <input
                      type="text"
                      formControlName="cardHolder"
                      placeholder="Name as on card"
                      class="mt-1 input w-full"
                      [class.border-red-500]="cardForm.get('cardHolder')?.invalid && cardForm.get('cardHolder')?.touched"
                    >
                    @if (cardForm.get('cardHolder')?.invalid && cardForm.get('cardHolder')?.touched) {
                      <p class="mt-1 text-sm text-red-600">Cardholder name is required</p>
                    }
                  </div>

                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Expiry Date</label>
                      <input
                        type="text"
                        formControlName="expiryDate"
                        placeholder="MM/YY"
                        maxlength="5"
                        class="mt-1 input w-full"
                        [class.border-red-500]="cardForm.get('expiryDate')?.invalid && cardForm.get('expiryDate')?.touched"
                        (input)="formatExpiryDate($event)"
                      >
                      @if (cardForm.get('expiryDate')?.invalid && cardForm.get('expiryDate')?.touched) {
                        <p class="mt-1 text-sm text-red-600">Enter valid expiry date</p>
                      }
                    </div>
                    
                    <div>
                      <label class="block text-sm font-medium text-gray-700">CVV</label>
                      <input
                        type="password"
                        formControlName="cvv"
                        placeholder="123"
                        maxlength="4"
                        class="mt-1 input w-full"
                        [class.border-red-500]="cardForm.get('cvv')?.invalid && cardForm.get('cvv')?.touched"
                      >
                      @if (cardForm.get('cvv')?.invalid && cardForm.get('cvv')?.touched) {
                        <p class="mt-1 text-sm text-red-600">Enter valid CVV</p>
                      }
                    </div>
                  </div>
                </form>
              </div>
            }

            <!-- UPI Payment Form -->
            @if (selectedMethod() === 'upi') {
              <div class="bg-white rounded-lg shadow-sm border p-6">
                <h4 class="font-semibold text-gray-900 mb-4">Enter UPI ID</h4>
                
                <form [formGroup]="upiForm">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">UPI ID</label>
                    <input
                      type="text"
                      formControlName="upiId"
                      placeholder="yourname@paytm"
                      class="mt-1 input w-full"
                      [class.border-red-500]="upiForm.get('upiId')?.invalid && upiForm.get('upiId')?.touched"
                    >
                    @if (upiForm.get('upiId')?.invalid && upiForm.get('upiId')?.touched) {
                      <p class="mt-1 text-sm text-red-600">Please enter a valid UPI ID</p>
                    }
                  </div>
                </form>
              </div>
            }

            <!-- Net Banking Form -->
            @if (selectedMethod() === 'netbanking') {
              <div class="bg-white rounded-lg shadow-sm border p-6">
                <h4 class="font-semibold text-gray-900 mb-4">Select Your Bank</h4>
                
                <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                  @for (bank of popularBanks; track bank) {
                    <label class="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                           [class.border-flipkart-blue]="selectedBank() === bank"
                           [class.bg-blue-50]="selectedBank() === bank">
                      <input
                        type="radio"
                        name="bank"
                        [value]="bank"
                        [(ngModel)]="selectedBank"
                        class="form-radio text-flipkart-blue"
                      >
                      <span class="ml-2 text-sm font-medium">{{ bank }}</span>
                    </label>
                  }
                </div>
              </div>
            }

            <!-- Security Note -->
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div class="flex items-start">
                <svg class="h-5 w-5 text-blue-400 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                </svg>
                <div class="ml-3">
                  <h4 class="text-sm font-medium text-blue-900">Security Information</h4>
                  <p class="text-sm text-blue-700 mt-1">
                    Your payment information is encrypted and secure. We never store your card details.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Payment Summary -->
          <div class="lg:col-span-1">
            <div class="bg-white rounded-lg shadow-sm border p-6 sticky top-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Payment Summary</h3>
              
              <div class="space-y-3 mb-6">
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">Order Total</span>
                  <span class="font-medium">₹{{ formatPrice(totalAmount()) }}</span>
                </div>
                
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">Payment Method</span>
                  <span class="font-medium capitalize">{{ getPaymentMethodName() }}</span>
                </div>
                
                <hr class="my-3">
                
                <div class="flex justify-between font-semibold text-lg">
                  <span>Amount to Pay</span>
                  <span class="text-flipkart-blue">₹{{ formatPrice(totalAmount()) }}</span>
                </div>
              </div>

              <!-- Payment Button -->
              <button
                (click)="processPayment()"
                [disabled]="!isPaymentFormValid() || processing()"
                class="btn-primary w-full py-3 mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                @if (processing()) {
                  <span class="flex items-center justify-center">
                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing Payment...
                  </span>
                } @else {
                  Pay ₹{{ formatPrice(totalAmount()) }}
                }
              </button>

              <a routerLink="/checkout" class="btn-outline w-full py-3 text-center block">
                Back to Checkout
              </a>

              <!-- Trust Badges -->
              <div class="mt-6 pt-6 border-t">
                <p class="text-xs text-gray-500 text-center mb-3">Secured by</p>
                <div class="flex justify-center space-x-4">
                  <span class="text-xs bg-gray-100 px-2 py-1 rounded">SSL Encrypted</span>
                  <span class="text-xs bg-gray-100 px-2 py-1 rounded">PCI Compliant</span>
                  <span class="text-xs bg-gray-100 px-2 py-1 rounded">256-bit Security</span>
                </div>
              </div>
            </div>
          </div>
        </div>
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
export class PaymentComponent implements OnInit {
  private cartService = inject(CartService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  selectedMethod = signal('card');
  selectedBank = signal('');
  processing = signal(false);
  totalAmount = signal(0);
  orderData: any;

  cardForm: FormGroup;
  upiForm: FormGroup;

  popularBanks = [
    'SBI', 'HDFC Bank', 'ICICI Bank', 
    'Axis Bank', 'Kotak Bank', 'Punjab National Bank',
    'Bank of Baroda', 'Canara Bank', 'Union Bank'
  ];

  constructor() {
    this.cardForm = this.fb.group({
      cardNumber: ['', [Validators.required, Validators.pattern(/^[0-9\s]{13,19}$/)]],
      cardHolder: ['', [Validators.required]],
      expiryDate: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/([0-9]{2})$/)]],
      cvv: ['', [Validators.required, Validators.pattern(/^[0-9]{3,4}$/)]]
    });

    this.upiForm = this.fb.group({
      upiId: ['', [Validators.required, Validators.pattern(/^[\w\.\-_]{3,}@[a-zA-Z]{3,}$/)]]
    });
  }

  ngOnInit() {
    // Get order data from navigation state
    this.orderData = history.state?.orderData;
    
    if (this.orderData) {
      this.totalAmount.set(this.orderData.totalAmount);
    } else {
      // If no order data, redirect to cart
      this.router.navigate(['/cart']);
    }
  }

  formatPrice(price: number): string {
    return price.toLocaleString('en-IN');
  }

  formatCardNumber(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    value = value.replace(/(.{4})/g, '$1 ').trim();
    event.target.value = value;
    this.cardForm.get('cardNumber')?.setValue(value);
  }

  formatExpiryDate(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    event.target.value = value;
    this.cardForm.get('expiryDate')?.setValue(value);
  }

  getPaymentMethodName(): string {
    const methods: { [key: string]: string } = {
      card: 'Credit/Debit Card',
      upi: 'UPI',
      netbanking: 'Net Banking',
      wallet: 'Wallet'
    };
    return methods[this.selectedMethod()] || 'Unknown';
  }

  isPaymentFormValid(): boolean {
    switch (this.selectedMethod()) {
      case 'card':
        return this.cardForm.valid;
      case 'upi':
        return this.upiForm.valid;
      case 'netbanking':
        return !!this.selectedBank();
      case 'wallet':
        return true;
      default:
        return false;
    }
  }

  processPayment() {
    if (!this.isPaymentFormValid()) {
      return;
    }

    this.processing.set(true);

    // Simulate payment processing
    setTimeout(() => {
      this.processing.set(false);
      
      // In a real app, you would integrate with actual payment gateway
      const paymentData = {
        method: this.selectedMethod(),
        amount: this.totalAmount(),
        timestamp: new Date().toISOString(),
        transactionId: this.generateTransactionId()
      };

      console.log('Payment processed:', paymentData);
      
      // Clear cart and redirect to success
      this.cartService.clearCart();
      alert('Payment successful! Your order has been placed. Transaction ID: ' + paymentData.transactionId);
      this.router.navigate(['/']);
    }, 3000);
  }

  private generateTransactionId(): string {
    return 'TXN' + Date.now() + Math.random().toString(36).substr(2, 9);
  }
}
