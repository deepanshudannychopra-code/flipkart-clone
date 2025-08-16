import { Routes } from "@angular/router";
import { HomeComponent } from "./pages/home/home.component";
import { PlaceholderComponent } from "./pages/placeholder/placeholder.component";
import { SearchComponent } from "./pages/search/search.component";
import { CartComponent } from "./pages/cart/cart.component";
import { LoginComponent } from "./pages/auth/login.component";
import { SignupComponent } from "./pages/auth/signup.component";
import { CheckoutComponent } from "./pages/checkout/checkout.component";
import { PaymentComponent } from "./pages/payment/payment.component";

export const routes: Routes = [
  {
    path: "",
    component: HomeComponent,
  },
  {
    path: "products",
    component: PlaceholderComponent,
    data: {
      title: "All Products",
      description:
        "Browse our complete collection of products across all categories.",
      icon: "🛍️",
      suggestions: [
        { title: "Electronics", icon: "📱", link: "/category/electronics" },
        { title: "Fashion", icon: "👕", link: "/category/fashion" },
        {
          title: "Home & Kitchen",
          icon: "���",
          link: "/category/home-kitchen",
        },
      ],
    },
  },
  {
    path: "category/:category",
    component: PlaceholderComponent,
    data: {
      title: "Category Products",
      description:
        "Explore products in this category with advanced filters and sorting options.",
      icon: "📂",
      suggestions: [
        { title: "All Products", icon: "🛍️", link: "/products" },
        { title: "Search", icon: "🔍", link: "/" },
        { title: "Deals", icon: "💰", link: "/deals" },
      ],
    },
  },
  {
    path: "product/:id",
    component: PlaceholderComponent,
    data: {
      title: "Product Details",
      description:
        "View detailed product information, images, reviews, and specifications.",
      icon: "📦",
      suggestions: [
        { title: "Continue Shopping", icon: "🛍️", link: "/" },
        { title: "Similar Products", icon: "🔄", link: "/products" },
        { title: "Reviews", icon: "⭐", link: "/" },
      ],
    },
  },
  {
    path: "cart",
    component: CartComponent,
  },
  {
    path: "login",
    component: LoginComponent,
  },
  {
    path: "signup",
    component: SignupComponent,
  },
  {
    path: "wishlist",
    component: PlaceholderComponent,
    data: {
      title: "Wishlist",
      description:
        "Save your favorite items for later and get notified of price drops.",
      icon: "❤️",
      suggestions: [
        { title: "Shop Now", icon: "🛍️", link: "/" },
        { title: "Cart", icon: "🛒", link: "/cart" },
        { title: "Deals", icon: "💰", link: "/deals" },
      ],
    },
  },
  {
    path: "checkout",
    component: CheckoutComponent,
  },
  {
    path: "payment",
    component: PaymentComponent,
  },
  {
    path: "deals",
    component: PlaceholderComponent,
    data: {
      title: "Special Deals",
      description:
        "Discover amazing discounts and limited-time offers on popular products.",
      icon: "💰",
      suggestions: [
        { title: "All Products", icon: "🛍️", link: "/products" },
        { title: "Categories", icon: "📂", link: "/" },
        { title: "Flash Sales", icon: "⚡", link: "/flash-sales" },
      ],
    },
  },
  {
    path: "orders",
    component: PlaceholderComponent,
    data: {
      title: "My Orders",
      description: "Track your orders, view order history, and manage returns.",
      icon: "📦",
      suggestions: [
        { title: "Shop Again", icon: "🛍️", link: "/" },
        { title: "Support", icon: "🎧", link: "/support" },
        { title: "Account", icon: "👤", link: "/account" },
      ],
    },
  },
  {
    path: "search",
    component: SearchComponent,
  },
  {
    path: "**",
    component: PlaceholderComponent,
    data: {
      title: "Page Not Found",
      description:
        "The page you're looking for doesn't exist or has been moved.",
      icon: "🔍",
      suggestions: [
        { title: "Home", icon: "🏠", link: "/" },
        { title: "All Products", icon: "🛍️", link: "/products" },
        { title: "Categories", icon: "📂", link: "/" },
      ],
    },
  },
];
