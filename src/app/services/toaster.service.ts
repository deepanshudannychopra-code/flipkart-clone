import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    handler: () => void;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ToasterService {
  private toasts = signal<Toast[]>([]);
  
  readonly toasts$ = this.toasts.asReadonly();

  show(toast: Omit<Toast, 'id'>): void {
    const id = this.generateId();
    const newToast: Toast = {
      id,
      duration: 4000, // Default 4 seconds
      ...toast
    };

    this.toasts.update(toasts => [...toasts, newToast]);

    // Auto-remove toast after duration
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        this.remove(id);
      }, newToast.duration);
    }
  }

  remove(id: string): void {
    this.toasts.update(toasts => toasts.filter(toast => toast.id !== id));
  }

  clear(): void {
    this.toasts.set([]);
  }

  // Convenience methods
  success(title: string, message?: string, action?: Toast['action']): void {
    this.show({ type: 'success', title, message, action });
  }

  error(title: string, message?: string, action?: Toast['action']): void {
    this.show({ type: 'error', title, message, action, duration: 6000 });
  }

  warning(title: string, message?: string, action?: Toast['action']): void {
    this.show({ type: 'warning', title, message, action });
  }

  info(title: string, message?: string, action?: Toast['action']): void {
    this.show({ type: 'info', title, message, action });
  }

  // Cart-specific notifications
  productAdded(productName: string, quantity: number = 1): void {
    this.success(
      'Added to Cart!',
      `${productName} ${quantity > 1 ? `(${quantity})` : ''} added to your cart`,
      {
        label: 'View Cart',
        handler: () => {
          // This will be handled by the component
          window.location.href = '/cart';
        }
      }
    );
  }

  productRemoved(productName: string): void {
    this.info(
      'Removed from Cart',
      `${productName} has been removed from your cart`
    );
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
