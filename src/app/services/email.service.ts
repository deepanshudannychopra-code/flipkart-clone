import { Injectable, inject } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { AuthService } from './auth.service';
import { CartService } from './cart.service';
import { LocationService } from './location.service';

export interface OrderConfirmationData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  items: any[];
  totalAmount: number;
  deliveryAddress: any;
  paymentMethod: string;
  orderDate: string;
  estimatedDelivery: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private authService = inject(AuthService);
  private cartService = inject(CartService);
  private locationService = inject(LocationService);

  // EmailJS configuration - In production, these should be environment variables
  private readonly emailConfig = {
    serviceId: 'flipkart_service', // You'll need to configure this in EmailJS
    templateId: 'order_confirmation',
    publicKey: 'your_emailjs_public_key', // You'll need to get this from EmailJS
    isEnabled: false // Set to true when EmailJS is configured
  };

  constructor() {
    // In a real app, you would load EmailJS SDK
    // For demo purposes, we'll simulate the email functionality
  }

  sendOrderConfirmationEmail(orderData: OrderConfirmationData): Observable<boolean> {
    if (this.emailConfig.isEnabled) {
      return this.sendViaEmailJS(orderData);
    } else {
      return this.simulateEmailSending(orderData);
    }
  }

  private sendViaEmailJS(orderData: OrderConfirmationData): Observable<boolean> {
    // This would use the actual EmailJS SDK
    // emailjs.send(serviceId, templateId, templateParams, publicKey)
    
    const templateParams = {
      to_email: orderData.customerEmail,
      to_name: orderData.customerName,
      order_id: orderData.orderId,
      order_date: orderData.orderDate,
      total_amount: this.formatPrice(orderData.totalAmount),
      estimated_delivery: orderData.estimatedDelivery,
      delivery_address: this.formatAddress(orderData.deliveryAddress),
      payment_method: orderData.paymentMethod,
      items_list: this.formatItemsList(orderData.items),
      items_count: orderData.items.length
    };

    // Simulate EmailJS call
    return from(
      new Promise<boolean>((resolve, reject) => {
        setTimeout(() => {
          // In real implementation:
          // emailjs.send(this.emailConfig.serviceId, this.emailConfig.templateId, templateParams, this.emailConfig.publicKey)
          //   .then(() => resolve(true))
          //   .catch(() => reject(false));
          
          console.log('EmailJS would send:', templateParams);
          resolve(true);
        }, 1500);
      })
    );
  }

  private simulateEmailSending(orderData: OrderConfirmationData): Observable<boolean> {
    // Simulate email sending with a delay
    return from(
      new Promise<boolean>((resolve) => {
        setTimeout(() => {
          // Log the email content for demonstration
          console.log('📧 ORDER CONFIRMATION EMAIL SENT');
          console.log('=================================');
          console.log(`To: ${orderData.customerEmail}`);
          console.log(`Subject: Order Confirmation - #${orderData.orderId}`);
          console.log('');
          console.log(this.generateEmailContent(orderData));
          console.log('=================================');
          
          resolve(true);
        }, 1500);
      })
    );
  }

  private generateEmailContent(orderData: OrderConfirmationData): string {
    return `
Dear ${orderData.customerName},

Thank you for shopping with Flipkart! Your order has been confirmed.

ORDER DETAILS:
Order ID: #${orderData.orderId}
Order Date: ${orderData.orderDate}
Estimated Delivery: ${orderData.estimatedDelivery}

ITEMS ORDERED:
${this.formatItemsList(orderData.items)}

DELIVERY ADDRESS:
${this.formatAddress(orderData.deliveryAddress)}

PAYMENT METHOD: ${orderData.paymentMethod}

ORDER SUMMARY:
Total Amount: ₹${this.formatPrice(orderData.totalAmount)}

You can track your order by visiting your orders page in the Flipkart app or website.

Thank you for choosing Flipkart!

Best regards,
Team Flipkart
    `.trim();
  }

  private formatItemsList(items: any[]): string {
    return items.map(item => 
      `• ${item.product.title} - Qty: ${item.quantity} - ₹${this.formatPrice(item.product.price * item.quantity)}`
    ).join('\n');
  }

  private formatAddress(address: any): string {
    return `${address.fullName}
${address.address}
${address.city}, ${address.state} - ${address.pincode}
Phone: ${address.phone}`;
  }

  private formatPrice(price: number): string {
    return price.toLocaleString('en-IN');
  }

  // Method to prepare order confirmation data
  prepareOrderConfirmationData(orderData: any): OrderConfirmationData {
    const user = this.authService.user();
    const location = this.locationService.location();
    const orderDate = new Date();
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 5); // 5 days from now

    return {
      orderId: this.generateOrderId(),
      customerName: orderData.address.fullName || user?.name || 'Valued Customer',
      customerEmail: user?.email || 'customer@example.com',
      items: orderData.items || this.cartService.items(),
      totalAmount: orderData.totalAmount || this.cartService.getTotalAmount(),
      deliveryAddress: orderData.address,
      paymentMethod: orderData.paymentMethod || 'Cash on Delivery',
      orderDate: orderDate.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }),
      estimatedDelivery: estimatedDelivery.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    };
  }

  private generateOrderId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `FK${timestamp}${random}`.toUpperCase();
  }

  // Method to send order status update emails
  sendOrderStatusEmail(orderId: string, status: string, customerEmail: string): Observable<boolean> {
    const emailData = {
      to_email: customerEmail,
      order_id: orderId,
      status: status,
      status_message: this.getStatusMessage(status)
    };

    return this.simulateEmailSending({
      orderId,
      customerEmail,
      customerName: 'Valued Customer',
      items: [],
      totalAmount: 0,
      deliveryAddress: {},
      paymentMethod: '',
      orderDate: new Date().toLocaleDateString(),
      estimatedDelivery: ''
    });
  }

  private getStatusMessage(status: string): string {
    const messages: { [key: string]: string } = {
      'confirmed': 'Your order has been confirmed and is being processed.',
      'shipped': 'Your order has been shipped and is on its way to you.',
      'delivered': 'Your order has been successfully delivered.',
      'cancelled': 'Your order has been cancelled as requested.'
    };
    return messages[status] || 'Your order status has been updated.';
  }
}
