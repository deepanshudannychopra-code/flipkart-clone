import { Injectable, signal, computed } from '@angular/core';
import { Product, CartItem } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = signal<CartItem[]>([]);
  
  // Computed properties
  readonly items = computed(() => this.cartItems());
  readonly itemCount = computed(() => 
    this.cartItems().reduce((count, item) => count + item.quantity, 0)
  );
  readonly totalPrice = computed(() =>
    this.cartItems().reduce((total, item) => total + (item.product.price * item.quantity), 0)
  );
  readonly totalSavings = computed(() =>
    this.cartItems().reduce((savings, item) => {
      const originalPrice = item.product.originalPrice || item.product.price;
      const discount = (originalPrice - item.product.price) * item.quantity;
      return savings + discount;
    }, 0)
  );

  constructor() {
    // Load cart from localStorage on initialization
    this.loadCartFromStorage();
  }

  addToCart(product: Product, quantity: number = 1): void {
    const currentItems = this.cartItems();
    const existingItemIndex = currentItems.findIndex(item => item.product.id === product.id);

    if (existingItemIndex >= 0) {
      // Update quantity if item already exists
      const updatedItems = [...currentItems];
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: updatedItems[existingItemIndex].quantity + quantity
      };
      this.cartItems.set(updatedItems);
    } else {
      // Add new item
      const newItem: CartItem = { product, quantity };
      this.cartItems.set([...currentItems, newItem]);
    }

    this.saveCartToStorage();
  }

  removeFromCart(productId: string): void {
    const currentItems = this.cartItems();
    const updatedItems = currentItems.filter(item => item.product.id !== productId);
    this.cartItems.set(updatedItems);
    this.saveCartToStorage();
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    const currentItems = this.cartItems();
    const updatedItems = currentItems.map(item =>
      item.product.id === productId
        ? { ...item, quantity }
        : item
    );
    this.cartItems.set(updatedItems);
    this.saveCartToStorage();
  }

  clearCart(): void {
    this.cartItems.set([]);
    this.saveCartToStorage();
  }

  isInCart(productId: string): boolean {
    return this.cartItems().some(item => item.product.id === productId);
  }

  getItemQuantity(productId: string): number {
    const item = this.cartItems().find(item => item.product.id === productId);
    return item ? item.quantity : 0;
  }

  private saveCartToStorage(): void {
    try {
      const cartData = JSON.stringify(this.cartItems());
      localStorage.setItem('flipkart_cart', cartData);
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }

  private loadCartFromStorage(): void {
    try {
      const savedCart = localStorage.getItem('flipkart_cart');
      if (savedCart) {
        const cartData: CartItem[] = JSON.parse(savedCart);
        this.cartItems.set(cartData);
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      this.cartItems.set([]);
    }
  }

  // Helper methods for cart calculations
  getSubtotal(): number {
    return this.totalPrice();
  }

  getDeliveryCharge(): number {
    // Free delivery for orders above ₹499
    return this.totalPrice() >= 499 ? 0 : 40;
  }

  getTotalAmount(): number {
    return this.getSubtotal() + this.getDeliveryCharge();
  }

  getFreeDeliveryMessage(): string {
    const remaining = 499 - this.totalPrice();
    if (remaining > 0) {
      return `Add items worth ₹${remaining.toLocaleString()} more for FREE delivery`;
    }
    return 'You get FREE delivery on this order!';
  }
}
