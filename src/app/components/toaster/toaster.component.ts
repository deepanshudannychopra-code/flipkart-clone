import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ToasterService, Toast } from "../../services/toaster.service";

@Component({
  selector: "app-toaster",
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Toast Container -->
    <div class="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      @for (toast of toasterService.toasts$(); track toast.id) {
        <div
          class="toast animate-slide-up transform transition-all duration-300 ease-out"
          [class]="getToastClasses(toast.type)"
        >
          <div class="flex items-start">
            <!-- Icon -->
            <div class="flex-shrink-0 mr-3">
              @switch (toast.type) {
                @case ("success") {
                  <div class="w-5 h-5 text-white">
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                }
                @case ("error") {
                  <div class="w-5 h-5 text-white">
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                }
                @case ("warning") {
                  <div class="w-5 h-5 text-white">
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fill-rule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5v3a.75.75 0 001.5 0v-3A.75.75 0 009 9z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                }
                @case ("info") {
                  <div class="w-5 h-5 text-white">
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fill-rule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                }
              }
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <div class="text-sm font-semibold text-white">
                {{ toast.title }}
              </div>
              @if (toast.message) {
                <div class="text-sm text-white/90 mt-1">
                  {{ toast.message }}
                </div>
              }

              @if (toast.action) {
                <button
                  (click)="handleAction(toast)"
                  class="mt-2 text-sm font-medium text-white underline hover:no-underline"
                >
                  {{ toast.action.label }}
                </button>
              }
            </div>

            <!-- Close Button -->
            <button
              (click)="closeToast(toast.id)"
              class="flex-shrink-0 ml-2 text-white/80 hover:text-white"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .toast {
        @apply p-4 rounded-lg shadow-lg border max-w-sm w-full backdrop-blur-sm;
      }

      .animate-slide-up {
        animation: slideUp 0.3s ease-out;
      }

      @keyframes slideUp {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }

      .toast-success {
        @apply bg-flipkart-green border-green-400;
      }

      .toast-error {
        @apply bg-flipkart-red border-red-400;
      }

      .toast-warning {
        @apply bg-flipkart-yellow border-yellow-400;
      }

      .toast-info {
        @apply bg-flipkart-blue border-blue-400;
      }
    `,
  ],
})
export class ToasterComponent {
  toasterService = inject(ToasterService);

  getToastClasses(type: Toast["type"]): string {
    const baseClasses = "toast";
    switch (type) {
      case "success":
        return `${baseClasses} toast-success`;
      case "error":
        return `${baseClasses} toast-error`;
      case "warning":
        return `${baseClasses} toast-warning`;
      case "info":
        return `${baseClasses} toast-info`;
      default:
        return `${baseClasses} toast-info`;
    }
  }

  closeToast(id: string): void {
    this.toasterService.remove(id);
  }

  handleAction(toast: Toast): void {
    if (toast.action) {
      toast.action.handler();
      this.closeToast(toast.id);
    }
  }
}
