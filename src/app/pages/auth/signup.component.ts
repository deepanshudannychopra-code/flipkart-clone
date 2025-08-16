import { Component, signal, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink, Router } from "@angular/router";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from "@angular/forms";
import { AuthService } from "../../services/auth.service";

// Custom validator for password confirmation
function passwordMatchValidator(
  control: AbstractControl,
): ValidationErrors | null {
  const password = control.get("password");
  const confirmPassword = control.get("confirmPassword");

  if (password && confirmPassword && password.value !== confirmPassword.value) {
    return { passwordMismatch: true };
  }

  return null;
}

@Component({
  selector: "app-signup",
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  template: `
    <div
      class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
    >
      <div class="max-w-md w-full space-y-8">
        <!-- Header -->
        <div class="text-center">
          <a routerLink="/" class="inline-block">
            <div class="text-3xl font-bold text-flipkart-blue">
              <span class="bg-flipkart-blue text-white px-3 py-2 rounded italic"
                >F</span
              >lipkart
            </div>
          </a>
          <h2 class="mt-6 text-3xl font-bold text-gray-900">
            Create your account
          </h2>
          <p class="mt-2 text-sm text-gray-600">
            Already have an account?
            <a
              routerLink="/login"
              class="font-medium text-flipkart-blue hover:text-flipkart-blue/80"
            >
              Sign in here
            </a>
          </p>
        </div>

        <!-- Signup Form -->
        <div class="bg-white rounded-lg shadow-sm border p-8">
          <form [formGroup]="signupForm" (ngSubmit)="onSubmit()">
            @if (error()) {
              <div class="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                <div class="flex">
                  <svg
                    class="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <div class="ml-3">
                    <p class="text-sm text-red-700">{{ error() }}</p>
                  </div>
                </div>
              </div>
            }

            <div class="space-y-6">
              <!-- Name Field -->
              <div>
                <label
                  for="name"
                  class="block text-sm font-medium text-gray-700"
                >
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autocomplete="name"
                  formControlName="name"
                  class="mt-1 input w-full"
                  [class.border-red-500]="
                    signupForm.get('name')?.invalid &&
                    signupForm.get('name')?.touched
                  "
                  placeholder="Enter your full name"
                />
                @if (
                  signupForm.get("name")?.invalid &&
                  signupForm.get("name")?.touched
                ) {
                  <p class="mt-1 text-sm text-red-600">
                    @if (signupForm.get("name")?.errors?.["required"]) {
                      Full name is required
                    }
                    @if (signupForm.get("name")?.errors?.["minlength"]) {
                      Name must be at least 2 characters long
                    }
                  </p>
                }
              </div>

              <!-- Email Field -->
              <div>
                <label
                  for="email"
                  class="block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autocomplete="email"
                  formControlName="email"
                  class="mt-1 input w-full"
                  [class.border-red-500]="
                    signupForm.get('email')?.invalid &&
                    signupForm.get('email')?.touched
                  "
                  placeholder="Enter your email"
                />
                @if (
                  signupForm.get("email")?.invalid &&
                  signupForm.get("email")?.touched
                ) {
                  <p class="mt-1 text-sm text-red-600">
                    @if (signupForm.get("email")?.errors?.["required"]) {
                      Email is required
                    }
                    @if (signupForm.get("email")?.errors?.["email"]) {
                      Please enter a valid email address
                    }
                  </p>
                }
              </div>

              <!-- Phone Field -->
              <div>
                <label
                  for="phone"
                  class="block text-sm font-medium text-gray-700"
                >
                  Phone Number (Optional)
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autocomplete="tel"
                  formControlName="phone"
                  class="mt-1 input w-full"
                  [class.border-red-500]="
                    signupForm.get('phone')?.invalid &&
                    signupForm.get('phone')?.touched
                  "
                  placeholder="Enter your phone number"
                />
                @if (
                  signupForm.get("phone")?.invalid &&
                  signupForm.get("phone")?.touched
                ) {
                  <p class="mt-1 text-sm text-red-600">
                    @if (signupForm.get("phone")?.errors?.["pattern"]) {
                      Please enter a valid phone number
                    }
                  </p>
                }
              </div>

              <!-- Password Field -->
              <div>
                <label
                  for="password"
                  class="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div class="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    [type]="showPassword() ? 'text' : 'password'"
                    autocomplete="new-password"
                    formControlName="password"
                    class="input w-full pr-10"
                    [class.border-red-500]="
                      signupForm.get('password')?.invalid &&
                      signupForm.get('password')?.touched
                    "
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    (click)="togglePasswordVisibility()"
                    class="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    @if (showPassword()) {
                      <svg
                        class="h-5 w-5 text-gray-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                          clip-rule="evenodd"
                        />
                        <path
                          d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z"
                        />
                      </svg>
                    } @else {
                      <svg
                        class="h-5 w-5 text-gray-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path
                          fill-rule="evenodd"
                          d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    }
                  </button>
                </div>
                @if (
                  signupForm.get("password")?.invalid &&
                  signupForm.get("password")?.touched
                ) {
                  <p class="mt-1 text-sm text-red-600">
                    @if (signupForm.get("password")?.errors?.["required"]) {
                      Password is required
                    }
                    @if (signupForm.get("password")?.errors?.["minlength"]) {
                      Password must be at least 8 characters long
                    }
                    @if (signupForm.get("password")?.errors?.["pattern"]) {
                      Password must contain at least one uppercase letter, one
                      lowercase letter, and one number
                    }
                  </p>
                }
              </div>

              <!-- Confirm Password Field -->
              <div>
                <label
                  for="confirmPassword"
                  class="block text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>
                <div class="mt-1 relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    [type]="showConfirmPassword() ? 'text' : 'password'"
                    autocomplete="new-password"
                    formControlName="confirmPassword"
                    class="input w-full pr-10"
                    [class.border-red-500]="
                      (signupForm.get('confirmPassword')?.invalid ||
                        signupForm.errors?.['passwordMismatch']) &&
                      signupForm.get('confirmPassword')?.touched
                    "
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    (click)="toggleConfirmPasswordVisibility()"
                    class="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    @if (showConfirmPassword()) {
                      <svg
                        class="h-5 w-5 text-gray-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                          clip-rule="evenodd"
                        />
                        <path
                          d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z"
                        />
                      </svg>
                    } @else {
                      <svg
                        class="h-5 w-5 text-gray-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path
                          fill-rule="evenodd"
                          d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    }
                  </button>
                </div>
                @if (
                  (signupForm.get("confirmPassword")?.invalid ||
                    signupForm.errors?.["passwordMismatch"]) &&
                  signupForm.get("confirmPassword")?.touched
                ) {
                  <p class="mt-1 text-sm text-red-600">
                    @if (
                      signupForm.get("confirmPassword")?.errors?.["required"]
                    ) {
                      Please confirm your password
                    }
                    @if (signupForm.errors?.["passwordMismatch"]) {
                      Passwords do not match
                    }
                  </p>
                }
              </div>

              <!-- Terms & Conditions -->
              <div class="flex items-start">
                <div class="flex items-center h-5">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    formControlName="terms"
                    class="h-4 w-4 text-flipkart-blue focus:ring-flipkart-blue border-gray-300 rounded"
                  />
                </div>
                <div class="ml-3 text-sm">
                  <label for="terms" class="text-gray-600">
                    I agree to the
                    <a
                      href="#"
                      class="text-flipkart-blue hover:text-flipkart-blue/80"
                      >Terms and Conditions</a
                    >
                    and
                    <a
                      href="#"
                      class="text-flipkart-blue hover:text-flipkart-blue/80"
                      >Privacy Policy</a
                    >
                  </label>
                  @if (
                    signupForm.get("terms")?.invalid &&
                    signupForm.get("terms")?.touched
                  ) {
                    <p class="mt-1 text-red-600">
                      You must agree to the terms and conditions
                    </p>
                  }
                </div>
              </div>

              <!-- Submit Button -->
              <div>
                <button
                  type="submit"
                  [disabled]="signupForm.invalid || loading()"
                  class="group relative w-full btn-primary py-3 px-4 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  @if (loading()) {
                    <span class="flex items-center justify-center">
                      <svg
                        class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          class="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          stroke-width="4"
                        ></circle>
                        <path
                          class="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Creating account...
                    </span>
                  } @else {
                    Create Account
                  }
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
})
export class SignupComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  signupForm: FormGroup;
  loading = signal(false);
  error = signal("");
  showPassword = signal(false);
  showConfirmPassword = signal(false);

  constructor() {
    this.signupForm = this.fb.group(
      {
        name: ["", [Validators.required, Validators.minLength(2)]],
        email: ["", [Validators.required, Validators.email]],
        phone: ["", [Validators.pattern(/^[\+]?[1-9][\d]{0,15}$/)]],
        password: [
          "",
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
          ],
        ],
        confirmPassword: ["", [Validators.required]],
        terms: [false, [Validators.requiredTrue]],
      },
      { validators: passwordMatchValidator },
    );
  }

  onSubmit() {
    if (this.signupForm.valid) {
      this.loading.set(true);
      this.error.set("");

      const signupData = {
        name: this.signupForm.value.name,
        email: this.signupForm.value.email,
        password: this.signupForm.value.password,
        phone: this.signupForm.value.phone,
      };

      this.authService.signup(signupData).subscribe({
        next: (user) => {
          this.loading.set(false);
          // Redirect to home page
          this.router.navigate(["/"]);
        },
        error: (error) => {
          this.loading.set(false);
          this.error.set(
            error.message || "Registration failed. Please try again.",
          );
        },
      });
    }
  }

  togglePasswordVisibility() {
    this.showPassword.set(!this.showPassword());
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword.set(!this.showConfirmPassword());
  }
}
