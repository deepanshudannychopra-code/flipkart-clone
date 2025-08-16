import { Component, signal, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink, Router } from "@angular/router";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <!-- Header -->
        <div class="text-center">
          <a routerLink="/" class="inline-block">
            <div class="text-3xl font-bold text-flipkart-blue">
              <span class="bg-flipkart-blue text-white px-3 py-2 rounded italic">F</span>lipkart
            </div>
          </a>
          <h2 class="mt-6 text-3xl font-bold text-gray-900">Sign in to your account</h2>
          <p class="mt-2 text-sm text-gray-600">
            Or
            <a routerLink="/signup" class="font-medium text-flipkart-blue hover:text-flipkart-blue/80">
              create a new account
            </a>
          </p>
        </div>

        <!-- Login Form -->
        <div class="bg-white rounded-lg shadow-sm border p-8">
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            @if (error()) {
              <div class="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                <div class="flex">
                  <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                  </svg>
                  <div class="ml-3">
                    <p class="text-sm text-red-700">{{ error() }}</p>
                  </div>
                </div>
              </div>
            }

            <div class="space-y-6">
              <!-- Email Field -->
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autocomplete="email"
                  formControlName="email"
                  class="mt-1 input w-full"
                  [class.border-red-500]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"
                  placeholder="Enter your email"
                >
                @if (loginForm.get('email')?.invalid && loginForm.get('email')?.touched) {
                  <p class="mt-1 text-sm text-red-600">
                    @if (loginForm.get('email')?.errors?.['required']) {
                      Email is required
                    }
                    @if (loginForm.get('email')?.errors?.['email']) {
                      Please enter a valid email address
                    }
                  </p>
                }
              </div>

              <!-- Password Field -->
              <div>
                <label for="password" class="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div class="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    [type]="showPassword() ? 'text' : 'password'"
                    autocomplete="current-password"
                    formControlName="password"
                    class="input w-full pr-10"
                    [class.border-red-500]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
                    placeholder="Enter your password"
                  >
                  <button
                    type="button"
                    (click)="togglePasswordVisibility()"
                    class="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    @if (showPassword()) {
                      <svg class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd"/>
                        <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z"/>
                      </svg>
                    } @else {
                      <svg class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                        <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/>
                      </svg>
                    }
                  </button>
                </div>
                @if (loginForm.get('password')?.invalid && loginForm.get('password')?.touched) {
                  <p class="mt-1 text-sm text-red-600">
                    @if (loginForm.get('password')?.errors?.['required']) {
                      Password is required
                    }
                    @if (loginForm.get('password')?.errors?.['minlength']) {
                      Password must be at least 6 characters long
                    }
                  </p>
                }
              </div>

              <!-- Remember Me & Forgot Password -->
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <input
                    id="remember"
                    name="remember"
                    type="checkbox"
                    formControlName="remember"
                    class="h-4 w-4 text-flipkart-blue focus:ring-flipkart-blue border-gray-300 rounded"
                  >
                  <label for="remember" class="ml-2 block text-sm text-gray-900">
                    Remember me
                  </label>
                </div>
                <div class="text-sm">
                  <button
                    type="button"
                    (click)="forgotPassword()"
                    class="font-medium text-flipkart-blue hover:text-flipkart-blue/80"
                  >
                    Forgot your password?
                  </button>
                </div>
              </div>

              <!-- Submit Button -->
              <div>
                <button
                  type="submit"
                  [disabled]="loginForm.invalid || loading()"
                  class="group relative w-full btn-primary py-3 px-4 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  @if (loading()) {
                    <span class="flex items-center justify-center">
                      <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </span>
                  } @else {
                    Sign in
                  }
                </button>
              </div>
            </div>
          </form>

          <!-- Demo Credentials -->
          <div class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <h4 class="text-sm font-medium text-blue-900 mb-2">Demo Credentials:</h4>
            <p class="text-sm text-blue-700">
              Email: <code class="bg-blue-100 px-1 rounded">demo@flipkart.com</code><br>
              Password: <code class="bg-blue-100 px-1 rounded">demo123</code>
            </p>
            <button
              type="button"
              (click)="fillDemoCredentials()"
              class="mt-2 text-sm text-blue-600 hover:text-blue-800 underline"
            >
              Fill demo credentials
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      code {
        font-family: "Courier New", Courier, monospace;
      }
    `,
  ],
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  loginForm: FormGroup;
  loading = signal(false);
  error = signal("");
  showPassword = signal(false);

  constructor() {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
      remember: [false],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading.set(true);
      this.error.set("");

      const credentials = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password,
      };

      this.authService.login(credentials).subscribe({
        next: (user) => {
          this.loading.set(false);
          // Redirect to the intended page or home
          const returnUrl =
            new URLSearchParams(window.location.search).get("returnUrl") || "/";
          this.router.navigate([returnUrl]);
        },
        error: (error) => {
          this.loading.set(false);
          this.error.set(error.message || "Login failed. Please try again.");
        },
      });
    }
  }

  forgotPassword() {
    const email = this.loginForm.get("email")?.value;
    if (email) {
      this.authService.forgotPassword(email).subscribe({
        next: () => {
          alert("Password reset instructions have been sent to your email.");
        },
        error: () => {
          alert("Failed to send password reset email. Please try again.");
        },
      });
    } else {
      alert("Please enter your email address first.");
    }
  }

  togglePasswordVisibility() {
    this.showPassword.set(!this.showPassword());
  }

  fillDemoCredentials() {
    this.loginForm.patchValue({
      email: "demo@flipkart.com",
      password: "demo123",
    });
  }
}
