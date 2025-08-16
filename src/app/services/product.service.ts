import { Injectable, signal } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Product, Category, Banner } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products = signal<Product[]>([
    {
      id: '1',
      title: 'Apple iPhone 15 Pro Max (256GB) - Natural Titanium',
      description: 'iPhone 15 Pro Max. Forged in titanium and featuring the groundbreaking A17 Pro chip, a customizable Action Button, and the most powerful iPhone camera system ever.',
      price: 159900,
      originalPrice: 179900,
      discount: 11,
      rating: 4.6,
      reviewCount: 5847,
      category: 'Electronics',
      brand: 'Apple',
      images: [
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400'
      ],
      features: ['6.7-inch Super Retina XDR display', 'A17 Pro chip', 'Pro camera system', '256GB storage'],
      inStock: true,
      freeDelivery: true,
      tags: ['bestseller', 'premium']
    },
    {
      id: '2',
      title: 'Samsung Galaxy Watch6 Classic 43mm Bluetooth',
      description: 'Advanced health monitoring, fitness tracking, and seamless connectivity in a classic design.',
      price: 32999,
      originalPrice: 39999,
      discount: 18,
      rating: 4.4,
      reviewCount: 2156,
      category: 'Electronics',
      brand: 'Samsung',
      images: [
        'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400',
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'
      ],
      features: ['43mm Classic design', 'Health monitoring', 'GPS tracking', 'Water resistant'],
      inStock: true,
      freeDelivery: true,
      tags: ['trending']
    },
    {
      id: '3',
      title: 'Sony WH-1000XM5 Wireless Noise Canceling Headphones',
      description: 'Industry-leading noise canceling with two processors controlling 8 microphones for exceptional sound quality.',
      price: 29990,
      originalPrice: 34990,
      discount: 14,
      rating: 4.7,
      reviewCount: 8934,
      category: 'Electronics',
      brand: 'Sony',
      images: [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
        'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400'
      ],
      features: ['30-hour battery life', 'Industry-leading noise canceling', 'Speak-to-chat technology', 'Premium comfort'],
      inStock: true,
      freeDelivery: true,
      tags: ['bestseller', 'audio']
    },
    {
      id: '4',
      title: 'Nike Air Force 1 \'07 Men\'s Shoes',
      description: 'The radiance lives on in the Nike Air Force 1 \'07, the basketball original that puts a fresh spin on what you know best.',
      price: 7495,
      originalPrice: 8995,
      discount: 17,
      rating: 4.5,
      reviewCount: 12654,
      category: 'Fashion',
      brand: 'Nike',
      images: [
        'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400',
        'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400'
      ],
      features: ['Classic basketball style', 'Premium leather upper', 'Nike Air cushioning', 'Rubber outsole'],
      inStock: true,
      freeDelivery: true,
      tags: ['fashion', 'sports']
    },
    {
      id: '5',
      title: 'Fossil Gen 6 Smartwatch',
      description: 'Powered by Wear OS by Google, this smartwatch keeps you connected and organized.',
      price: 18995,
      originalPrice: 24995,
      discount: 24,
      rating: 4.2,
      reviewCount: 1876,
      category: 'Electronics',
      brand: 'Fossil',
      images: [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
        'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400'
      ],
      features: ['Wear OS by Google', 'Heart rate tracking', 'GPS', 'Water resistant'],
      inStock: true,
      freeDelivery: false,
      tags: ['smartwatch']
    },
    {
      id: '6',
      title: 'Levi\'s 511 Slim Fit Jeans',
      description: 'The 511™ Slim Fit Jeans are cut close to the body with a streamlined leg from hip to ankle.',
      price: 2999,
      originalPrice: 3999,
      discount: 25,
      rating: 4.3,
      reviewCount: 5642,
      category: 'Fashion',
      brand: 'Levi\'s',
      images: [
        'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',
        'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400'
      ],
      features: ['Slim fit', '99% cotton', 'Classic 5-pocket styling', 'Machine washable'],
      inStock: true,
      freeDelivery: true,
      tags: ['fashion', 'denim']
    }
  ]);

  private categories = signal<Category[]>([
    { id: '1', name: 'Electronics', icon: '📱', subcategories: ['Mobiles', 'Laptops', 'Audio', 'Cameras'] },
    { id: '2', name: 'Fashion', icon: '👕', subcategories: ['Men', 'Women', 'Kids', 'Footwear'] },
    { id: '3', name: 'Home & Kitchen', icon: '🏠', subcategories: ['Furniture', 'Appliances', 'Decor', 'Kitchen'] },
    { id: '4', name: 'Books', icon: '📚', subcategories: ['Fiction', 'Non-fiction', 'Educational', 'Comics'] },
    { id: '5', name: 'Sports', icon: '⚽', subcategories: ['Fitness', 'Outdoor', 'Team Sports', 'Individual Sports'] },
    { id: '6', name: 'Beauty', icon: '💄', subcategories: ['Skincare', 'Makeup', 'Hair Care', 'Fragrances'] }
  ]);

  private banners = signal<Banner[]>([
    {
      id: '1',
      title: 'Big Billion Days',
      subtitle: 'Unbeatable Deals on Electronics',
      image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&h=300&fit=crop',
      link: '/deals',
      buttonText: 'Shop Now'
    },
    {
      id: '2',
      title: 'Fashion Week Sale',
      subtitle: 'Up to 70% off on Top Brands',
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=300&fit=crop',
      link: '/fashion',
      buttonText: 'Explore Fashion'
    },
    {
      id: '3',
      title: 'Home Decor Festival',
      subtitle: 'Transform your space',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=300&fit=crop',
      link: '/home',
      buttonText: 'Discover More'
    }
  ]);

  getAllProducts(): Observable<Product[]> {
    return of(this.products()).pipe(delay(500));
  }

  getProductById(id: string): Observable<Product | undefined> {
    const product = this.products().find(p => p.id === id);
    return of(product).pipe(delay(300));
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    const filtered = this.products().filter(p => 
      p.category.toLowerCase() === category.toLowerCase()
    );
    return of(filtered).pipe(delay(400));
  }

  searchProducts(query: string): Observable<Product[]> {
    const filtered = this.products().filter(p =>
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase()) ||
      p.brand.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase())
    );
    return of(filtered).pipe(delay(300));
  }

  getCategories(): Observable<Category[]> {
    return of(this.categories());
  }

  getBanners(): Observable<Banner[]> {
    return of(this.banners());
  }

  getFeaturedProducts(): Observable<Product[]> {
    const featured = this.products().filter(p => p.tags?.includes('bestseller') || p.rating >= 4.5);
    return of(featured.slice(0, 8)).pipe(delay(400));
  }

  getTrendingProducts(): Observable<Product[]> {
    const trending = this.products().filter(p => p.tags?.includes('trending') || p.discount! >= 15);
    return of(trending.slice(0, 6)).pipe(delay(400));
  }
}
