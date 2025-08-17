import { Injectable, signal } from "@angular/core";
import { Observable, of, delay } from "rxjs";
import { Product, Category, Banner } from "../models/product.model";

@Injectable({
  providedIn: "root",
})
export class ProductService {
  private products = signal<Product[]>([
    {
      id: "1",
      title: "Apple iPhone 15 Pro Max (256GB) - Natural Titanium",
      description:
        "iPhone 15 Pro Max. Forged in titanium and featuring the groundbreaking A17 Pro chip, a customizable Action Button, and the most powerful iPhone camera system ever.",
      price: 159900,
      originalPrice: 179900,
      discount: 11,
      rating: 4.6,
      reviewCount: 5847,
      category: "Electronics",
      brand: "Apple",
      images: [
        "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400",
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
      ],
      features: [
        "6.7-inch Super Retina XDR display",
        "A17 Pro chip",
        "Pro camera system",
        "256GB storage",
      ],
      inStock: true,
      freeDelivery: true,
      tags: ["bestseller", "premium"],
    },
    {
      id: "2",
      title: "Samsung Galaxy Watch6 Classic 43mm Bluetooth",
      description:
        "Advanced health monitoring, fitness tracking, and seamless connectivity in a classic design.",
      price: 32999,
      originalPrice: 39999,
      discount: 18,
      rating: 4.4,
      reviewCount: 2156,
      category: "Electronics",
      brand: "Samsung",
      images: [
        "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400",
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
      ],
      features: [
        "43mm Classic design",
        "Health monitoring",
        "GPS tracking",
        "Water resistant",
      ],
      inStock: true,
      freeDelivery: true,
      tags: ["trending"],
    },
    {
      id: "3",
      title: "Sony WH-1000XM5 Wireless Noise Canceling Headphones",
      description:
        "Industry-leading noise canceling with two processors controlling 8 microphones for exceptional sound quality.",
      price: 29990,
      originalPrice: 34990,
      discount: 14,
      rating: 4.7,
      reviewCount: 8934,
      category: "Electronics",
      brand: "Sony",
      images: [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
        "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400",
      ],
      features: [
        "30-hour battery life",
        "Industry-leading noise canceling",
        "Speak-to-chat technology",
        "Premium comfort",
      ],
      inStock: true,
      freeDelivery: true,
      tags: ["bestseller", "audio"],
    },
    {
      id: "4",
      title: "Nike Air Force 1 '07 Men's Shoes",
      description:
        "The radiance lives on in the Nike Air Force 1 '07, the basketball original that puts a fresh spin on what you know best.",
      price: 7495,
      originalPrice: 8995,
      discount: 17,
      rating: 4.5,
      reviewCount: 12654,
      category: "Fashion",
      brand: "Nike",
      images: [
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400",
        "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400",
      ],
      features: [
        "Classic basketball style",
        "Premium leather upper",
        "Nike Air cushioning",
        "Rubber outsole",
      ],
      inStock: true,
      freeDelivery: true,
      tags: ["fashion", "sports"],
    },
    {
      id: "5",
      title: "Fossil Gen 6 Smartwatch",
      description:
        "Powered by Wear OS by Google, this smartwatch keeps you connected and organized.",
      price: 18995,
      originalPrice: 24995,
      discount: 24,
      rating: 4.2,
      reviewCount: 1876,
      category: "Electronics",
      brand: "Fossil",
      images: [
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
        "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400",
      ],
      features: [
        "Wear OS by Google",
        "Heart rate tracking",
        "GPS",
        "Water resistant",
      ],
      inStock: true,
      freeDelivery: false,
      tags: ["smartwatch"],
    },
    {
      id: "6",
      title: "Levi's 511 Slim Fit Jeans",
      description:
        "The 511™ Slim Fit Jeans are cut close to the body with a streamlined leg from hip to ankle.",
      price: 2999,
      originalPrice: 3999,
      discount: 25,
      rating: 4.3,
      reviewCount: 5642,
      category: "Fashion",
      brand: "Levi's",
      images: [
        "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400",
        "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400",
      ],
      features: [
        "Slim fit",
        "99% cotton",
        "Classic 5-pocket styling",
        "Machine washable",
      ],
      inStock: true,
      freeDelivery: true,
      tags: ["fashion", "denim"],
    },
    // More Electronics
    {
      id: "7",
      title: "Dell XPS 13 Laptop (13th Gen Intel Core i7)",
      description:
        "Ultra-portable laptop with stunning 13.4-inch InfinityEdge display and powerful performance.",
      price: 134999,
      originalPrice: 154999,
      discount: 13,
      rating: 4.5,
      reviewCount: 2341,
      category: "Electronics",
      brand: "Dell",
      images: [
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
        "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400",
      ],
      features: [
        "13th Gen Intel Core i7",
        "16GB RAM",
        "512GB SSD",
        "13.4-inch FHD+ display",
      ],
      inStock: true,
      freeDelivery: true,
      tags: ["bestseller", "laptop"],
    },
    {
      id: "8",
      title: "Canon EOS R6 Mark II Mirrorless Camera",
      description:
        "Professional mirrorless camera with dual pixel CMOS AF II and 4K video recording.",
      price: 219999,
      originalPrice: 249999,
      discount: 12,
      rating: 4.8,
      reviewCount: 987,
      category: "Electronics",
      brand: "Canon",
      images: [
        "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400",
        "https://images.unsplash.com/photo-1484755560615-676859b15fd7?w=400",
      ],
      features: [
        "24.2MP full-frame sensor",
        "Dual Pixel CMOS AF II",
        "4K 60p video",
        "In-body image stabilization",
      ],
      inStock: true,
      freeDelivery: true,
      tags: ["premium", "camera"],
    },
    {
      id: "9",
      title: "MacBook Air M2 Chip (13-inch, 8GB RAM, 256GB SSD)",
      description:
        "Supercharged by M2 chip, delivering exceptional performance and all-day battery life.",
      price: 114900,
      originalPrice: 119900,
      discount: 4,
      rating: 4.7,
      reviewCount: 4523,
      category: "Electronics",
      brand: "Apple",
      images: [
        "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400",
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
      ],
      features: [
        "Apple M2 chip",
        "13.6-inch Liquid Retina display",
        "8GB unified memory",
        "256GB SSD storage",
      ],
      inStock: true,
      freeDelivery: true,
      tags: ["bestseller", "premium"],
    },
    {
      id: "10",
      title: "JBL Charge 5 Portable Bluetooth Speaker",
      description:
        "Powerful portable speaker with IP67 waterproof rating and 20 hours of playtime.",
      price: 12999,
      originalPrice: 16999,
      discount: 24,
      rating: 4.4,
      reviewCount: 6789,
      category: "Electronics",
      brand: "JBL",
      images: [
        "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400",
        "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400",
      ],
      features: [
        "20 hours of playtime",
        "IP67 waterproof",
        "Bluetooth 5.1",
        "Power bank feature",
      ],
      inStock: true,
      freeDelivery: true,
      tags: ["trending", "audio"],
    },
    // More Fashion
    {
      id: "11",
      title: "Adidas Ultraboost 23 Running Shoes",
      description:
        "Energy-returning running shoes with responsive Boost midsole and Primeknit upper.",
      price: 17999,
      originalPrice: 21999,
      discount: 18,
      rating: 4.6,
      reviewCount: 8765,
      category: "Fashion",
      brand: "Adidas",
      images: [
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
      ],
      features: [
        "Boost midsole",
        "Primeknit upper",
        "Continental rubber outsole",
        "Responsive energy return",
      ],
      inStock: true,
      freeDelivery: true,
      tags: ["bestseller", "sports"],
    },
    {
      id: "12",
      title: "Zara Women's Blazer - Navy Blue",
      description:
        "Elegant navy blue blazer with structured shoulders and classic lapels. Perfect for office wear.",
      price: 4999,
      originalPrice: 6999,
      discount: 29,
      rating: 4.2,
      reviewCount: 3456,
      category: "Fashion",
      brand: "Zara",
      images: [
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400",
        "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400",
      ],
      features: [
        "Structured shoulders",
        "Classic lapels",
        "Professional fit",
        "100% polyester",
      ],
      inStock: true,
      freeDelivery: true,
      tags: ["fashion", "formal"],
    },
    {
      id: "13",
      title: "H&M Oversized Cotton T-Shirt - White",
      description:
        "Relaxed-fit t-shirt in soft cotton jersey with dropped shoulders and a slightly longer back hem.",
      price: 799,
      originalPrice: 1299,
      discount: 38,
      rating: 4.1,
      reviewCount: 12543,
      category: "Fashion",
      brand: "H&M",
      images: [
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
        "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400",
      ],
      features: [
        "100% cotton",
        "Oversized fit",
        "Dropped shoulders",
        "Machine washable",
      ],
      inStock: true,
      freeDelivery: false,
      tags: ["fashion", "casual"],
    },
    {
      id: "14",
      title: "Ray-Ban Aviator Classic Sunglasses",
      description:
        "Iconic aviator sunglasses with teardrop lenses and thin metal frames. Timeless style.",
      price: 8999,
      originalPrice: 12999,
      discount: 31,
      rating: 4.5,
      reviewCount: 5432,
      category: "Fashion",
      brand: "Ray-Ban",
      images: [
        "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400",
        "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400",
      ],
      features: [
        "100% UV protection",
        "Lightweight metal frame",
        "Teardrop lenses",
        "Adjustable nose pads",
      ],
      inStock: true,
      freeDelivery: true,
      tags: ["fashion", "sunglasses"],
    },
    // Home & Kitchen
    {
      id: "15",
      title: "IKEA HEMNES Bookcase - White Stain",
      description:
        "Solid wood bookcase with adjustable shelves. Perfect for living room or home office.",
      price: 12999,
      originalPrice: 15999,
      discount: 19,
      rating: 4.3,
      reviewCount: 2876,
      category: "Home & Kitchen",
      brand: "IKEA",
      images: [
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400",
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400",
      ],
      features: [
        "Solid wood construction",
        "Adjustable shelves",
        "White stain finish",
        "Easy assembly",
      ],
      inStock: true,
      freeDelivery: true,
      tags: ["furniture", "storage"],
    },
    {
      id: "16",
      title: "Prestige Deluxe Alpha Pressure Cooker 5L",
      description:
        "Stainless steel pressure cooker with unique deep lid for healthier cooking and better taste.",
      price: 3299,
      originalPrice: 4299,
      discount: 23,
      rating: 4.4,
      reviewCount: 15678,
      category: "Home & Kitchen",
      brand: "Prestige",
      images: [
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400",
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400",
      ],
      features: [
        "5 liter capacity",
        "Stainless steel body",
        "Controlled gasket release system",
        "Metallic safety plug",
      ],
      inStock: true,
      freeDelivery: true,
      tags: ["kitchen", "bestseller"],
    },
    {
      id: "17",
      title: "Philips Air Fryer HD9252/90 - Digital Touch Panel",
      description:
        "Rapid air technology for frying, baking, grilling, and roasting with little to no oil.",
      price: 9999,
      originalPrice: 13999,
      discount: 29,
      rating: 4.6,
      reviewCount: 8432,
      category: "Home & Kitchen",
      brand: "Philips",
      images: [
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400",
        "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400",
      ],
      features: [
        "Rapid air technology",
        "Digital touch panel",
        "4.1L capacity",
        "Fat removal technology",
      ],
      inStock: true,
      freeDelivery: true,
      tags: ["appliances", "trending"],
    },
    {
      id: "18",
      title: "Urban Ladder Dining Table Set (4 Seater)",
      description:
        "Solid wood dining table with 4 chairs. Modern design perfect for small families.",
      price: 24999,
      originalPrice: 34999,
      discount: 29,
      rating: 4.2,
      reviewCount: 1234,
      category: "Home & Kitchen",
      brand: "Urban Ladder",
      images: [
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400",
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400",
      ],
      features: [
        "Solid wood construction",
        "4 seater capacity",
        "Modern design",
        "Easy maintenance",
      ],
      inStock: true,
      freeDelivery: true,
      tags: ["furniture", "dining"],
    },
    // Books
    {
      id: "19",
      title: "Atomic Habits by James Clear",
      description:
        "An easy and proven way to build good habits and break bad ones. International bestseller.",
      price: 399,
      originalPrice: 599,
      discount: 33,
      rating: 4.8,
      reviewCount: 25678,
      category: "Books",
      brand: "Random House",
      images: [
        "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400",
        "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400",
      ],
      features: [
        "Self-help book",
        "Habit formation guide",
        "Practical strategies",
        "320 pages",
      ],
      inStock: true,
      freeDelivery: true,
      tags: ["bestseller", "self-help"],
    },
    {
      id: "20",
      title: "The Alchemist by Paulo Coelho",
      description:
        "A magical story about following your dreams and the journey of self-discovery.",
      price: 299,
      originalPrice: 399,
      discount: 25,
      rating: 4.7,
      reviewCount: 45678,
      category: "Books",
      brand: "HarperCollins",
      images: [
        "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400",
        "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400",
      ],
      features: [
        "Fiction novel",
        "International bestseller",
        "Philosophical themes",
        "163 pages",
      ],
      inStock: true,
      freeDelivery: false,
      tags: ["bestseller", "fiction"],
    },
    {
      id: "21",
      title: "Think and Grow Rich by Napoleon Hill",
      description:
        "The landmark bestseller about achieving success and building wealth through positive thinking.",
      price: 249,
      originalPrice: 349,
      discount: 29,
      rating: 4.6,
      reviewCount: 18543,
      category: "Books",
      brand: "Penguin Random House",
      images: [
        "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
      ],
      features: [
        "Business & success",
        "Classic self-help",
        "Wealth building strategies",
        "288 pages",
      ],
      inStock: true,
      freeDelivery: false,
      tags: ["business", "classic"],
    },
    // Sports
    {
      id: "22",
      title: "Yonex Arcsaber 11 Badminton Racket",
      description:
        "Professional badminton racket with Sonic Metal technology for maximum power and control.",
      price: 18999,
      originalPrice: 22999,
      discount: 17,
      rating: 4.7,
      reviewCount: 3456,
      category: "Sports",
      brand: "Yonex",
      images: [
        "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400",
        "https://images.unsplash.com/photo-1594736797933-d0a9ba2fe65f?w=400",
      ],
      features: [
        "Sonic Metal technology",
        "Professional grade",
        "Medium flex",
        "85g weight",
      ],
      inStock: true,
      freeDelivery: true,
      tags: ["sports", "badminton"],
    },
    {
      id: "23",
      title: "Decathlon Domyos Bench 500 Weight Training Bench",
      description:
        "Adjustable weight training bench suitable for multiple exercises and fitness routines.",
      price: 12999,
      originalPrice: 16999,
      discount: 24,
      rating: 4.3,
      reviewCount: 2345,
      category: "Sports",
      brand: "Decathlon",
      images: [
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
        "https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?w=400",
      ],
      features: [
        "Adjustable positions",
        "180kg max load",
        "Foldable design",
        "Comfortable padding",
      ],
      inStock: true,
      freeDelivery: true,
      tags: ["fitness", "gym"],
    },
    {
      id: "24",
      title: "Nike Dri-FIT Running T-Shirt",
      description:
        "Lightweight running t-shirt with moisture-wicking technology to keep you dry and comfortable.",
      price: 1999,
      originalPrice: 2999,
      discount: 33,
      rating: 4.4,
      reviewCount: 7890,
      category: "Sports",
      brand: "Nike",
      images: [
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
        "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400",
      ],
      features: [
        "Dri-FIT technology",
        "Lightweight fabric",
        "Athletic fit",
        "100% polyester",
      ],
      inStock: true,
      freeDelivery: false,
      tags: ["sports", "running"],
    },
    // Beauty
    {
      id: "25",
      title: "Lakme Absolute Perfect Radiance Foundation",
      description:
        "Full coverage foundation with SPF 20 for radiant, flawless skin all day long.",
      price: 899,
      originalPrice: 1299,
      discount: 31,
      rating: 4.2,
      reviewCount: 8765,
      category: "Beauty",
      brand: "Lakme",
      images: [
        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400",
        "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400",
      ],
      features: [
        "Full coverage",
        "SPF 20 protection",
        "12-hour wear",
        "Suitable for all skin types",
      ],
      inStock: true,
      freeDelivery: false,
      tags: ["beauty", "makeup"],
    },
    {
      id: "26",
      title: "The Body Shop Tea Tree Face Wash",
      description:
        "Purifying face wash with tea tree oil to help cleanse and refresh blemish-prone skin.",
      price: 695,
      originalPrice: 995,
      discount: 30,
      rating: 4.5,
      reviewCount: 12345,
      category: "Beauty",
      brand: "The Body Shop",
      images: [
        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400",
        "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400",
      ],
      features: [
        "Tea tree oil formula",
        "For blemish-prone skin",
        "Daily use",
        "250ml bottle",
      ],
      inStock: true,
      freeDelivery: false,
      tags: ["beauty", "skincare"],
    },
    {
      id: "27",
      title: "Maybelline New York Colossal Kajal",
      description:
        "Intense black kajal with smudge-proof formula for bold, dramatic eyes that last all day.",
      price: 199,
      originalPrice: 299,
      discount: 33,
      rating: 4.3,
      reviewCount: 15678,
      category: "Beauty",
      brand: "Maybelline",
      images: [
        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400",
        "https://images.unsplash.com/photo-1583241475880-a5a1b0a29e99?w=400",
      ],
      features: [
        "Smudge-proof formula",
        "Intense black color",
        "12-hour wear",
        "Easy application",
      ],
      inStock: true,
      freeDelivery: false,
      tags: ["beauty", "makeup"],
    },
  ]);

  private categories = signal<Category[]>([
    {
      id: "1",
      name: "Electronics",
      icon: "📱",
      subcategories: ["Mobiles", "Laptops", "Audio", "Cameras"],
    },
    {
      id: "2",
      name: "Fashion",
      icon: "👕",
      subcategories: ["Men", "Women", "Kids", "Footwear"],
    },
    {
      id: "3",
      name: "Home & Kitchen",
      icon: "🏠",
      subcategories: ["Furniture", "Appliances", "Decor", "Kitchen"],
    },
    {
      id: "4",
      name: "Books",
      icon: "📚",
      subcategories: ["Fiction", "Non-fiction", "Educational", "Comics"],
    },
    {
      id: "5",
      name: "Sports",
      icon: "⚽",
      subcategories: ["Fitness", "Outdoor", "Team Sports", "Individual Sports"],
    },
    {
      id: "6",
      name: "Beauty",
      icon: "💄",
      subcategories: ["Skincare", "Makeup", "Hair Care", "Fragrances"],
    },
  ]);

  private banners = signal<Banner[]>([
    {
      id: "1",
      title: "Big Billion Days",
      subtitle: "Unbeatable Deals on Electronics",
      image:
        "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&h=300&fit=crop",
      link: "/deals",
      buttonText: "Shop Now",
    },
    {
      id: "2",
      title: "Fashion Week Sale",
      subtitle: "Up to 70% off on Top Brands",
      image:
        "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=300&fit=crop",
      link: "/fashion",
      buttonText: "Explore Fashion",
    },
    {
      id: "3",
      title: "Home Decor Festival",
      subtitle: "Transform your space",
      image:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=300&fit=crop",
      link: "/home",
      buttonText: "Discover More",
    },
  ]);

  getAllProducts(): Observable<Product[]> {
    return of(this.products()).pipe(delay(500));
  }

  getProductById(id: string): Observable<Product | undefined> {
    const product = this.products().find((p) => p.id === id);
    return of(product).pipe(delay(300));
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    const filtered = this.products().filter(
      (p) => p.category.toLowerCase() === category.toLowerCase(),
    );
    return of(filtered).pipe(delay(400));
  }

  searchProducts(query: string): Observable<Product[]> {
    const filtered = this.products().filter(
      (p) =>
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase()) ||
        p.brand.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase()),
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
    const featured = this.products().filter(
      (p) => p.tags?.includes("bestseller") || p.rating >= 4.5,
    );
    return of(featured.slice(0, 8)).pipe(delay(400));
  }

  getTrendingProducts(): Observable<Product[]> {
    const trending = this.products().filter(
      (p) => p.tags?.includes("trending") || p.discount! >= 15,
    );
    return of(trending.slice(0, 6)).pipe(delay(400));
  }
}
