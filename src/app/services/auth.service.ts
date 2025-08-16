import { Injectable, signal } from "@angular/core";
import { Observable, of, delay, throwError, from } from "rxjs";

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private currentUser = signal<User | null>(null);
  private isLoggedIn = signal<boolean>(false);

  // Public computed signals
  readonly user = this.currentUser.asReadonly();
  readonly loggedIn = this.isLoggedIn.asReadonly();

  constructor() {
    // Load user from localStorage on initialization
    this.loadUserFromStorage();
  }

  login(credentials: LoginCredentials): Observable<User> {
    // Simulate API call with delay
    const promise = new Promise<User>((resolve, reject) => {
      setTimeout(() => {
        // Mock validation
        if (
          credentials.email === "demo@flipkart.com" &&
          credentials.password === "demo123"
        ) {
          const user: User = {
            id: "1",
            email: credentials.email,
            name: "Demo User",
            phone: "+91 9876543210",
            avatar:
              "https://ui-avatars.com/api/?name=Demo+User&background=2874f0&color=fff",
          };

          this.setCurrentUser(user);
          resolve(user);
        } else {
          reject(new Error("Invalid email or password"));
        }
      }, 1000);
    });

    return from(promise);
  }

  signup(signupData: SignupData): Observable<User> {
    // Simulate API call with delay
    return new Promise<User>((resolve, reject) => {
      setTimeout(() => {
        // Mock validation
        if (signupData.email && signupData.password && signupData.name) {
          const user: User = {
            id: Date.now().toString(),
            email: signupData.email,
            name: signupData.name,
            phone: signupData.phone,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(signupData.name)}&background=2874f0&color=fff`,
          };

          this.setCurrentUser(user);
          resolve(user);
        } else {
          reject(new Error("Please fill in all required fields"));
        }
      }, 1000);
    }) as any;
  }

  logout(): void {
    this.currentUser.set(null);
    this.isLoggedIn.set(false);
    this.removeUserFromStorage();
  }

  forgotPassword(email: string): Observable<boolean> {
    // Simulate API call
    return of(true).pipe(delay(1000));
  }

  private setCurrentUser(user: User): void {
    this.currentUser.set(user);
    this.isLoggedIn.set(true);
    this.saveUserToStorage(user);
  }

  private saveUserToStorage(user: User): void {
    try {
      localStorage.setItem("flipkart_user", JSON.stringify(user));
      localStorage.setItem("flipkart_logged_in", "true");
    } catch (error) {
      console.error("Error saving user to localStorage:", error);
    }
  }

  private loadUserFromStorage(): void {
    try {
      const savedUser = localStorage.getItem("flipkart_user");
      const isLoggedIn = localStorage.getItem("flipkart_logged_in") === "true";

      if (savedUser && isLoggedIn) {
        const user: User = JSON.parse(savedUser);
        this.currentUser.set(user);
        this.isLoggedIn.set(true);
      }
    } catch (error) {
      console.error("Error loading user from localStorage:", error);
      this.logout();
    }
  }

  private removeUserFromStorage(): void {
    try {
      localStorage.removeItem("flipkart_user");
      localStorage.removeItem("flipkart_logged_in");
    } catch (error) {
      console.error("Error removing user from localStorage:", error);
    }
  }

  // Helper methods
  getUserDisplayName(): string {
    const user = this.currentUser();
    return user ? user.name : "Guest";
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn();
  }
}
