import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-placeholder",
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50 py-12">
      <div class="container-custom">
        <div class="text-center">
          <div class="text-6xl mb-6">{{ icon }}</div>
          <h1 class="text-3xl font-bold text-gray-900 mb-4">{{ title }}</h1>
          <p class="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            {{ description }}
          </p>
          <div
            class="bg-white rounded-lg shadow-sm border p-6 max-w-md mx-auto"
          >
            <p class="text-gray-700 mb-4">
              This page is under development. Continue exploring or help us
              build this feature!
            </p>
            <div class="space-y-3">
              <a
                routerLink="/"
                class="btn-primary block py-3 px-6 rounded-md text-center"
              >
                Back to Home
              </a>
              <button
                class="btn-outline block w-full py-3 px-6 rounded-md text-center"
              >
                Request this Feature
              </button>
            </div>
          </div>

          @if (suggestions && suggestions.length > 0) {
            <div class="mt-12">
              <h3 class="text-xl font-semibold text-gray-900 mb-4">
                You might also like:
              </h3>
              <div class="flex flex-wrap justify-center gap-4">
                @for (suggestion of suggestions; track suggestion.link) {
                  <a
                    [routerLink]="suggestion.link"
                    class="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow"
                  >
                    <div class="text-2xl mb-2">{{ suggestion.icon }}</div>
                    <div class="text-sm font-medium text-gray-900">
                      {{ suggestion.title }}
                    </div>
                  </a>
                }
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .container-custom {
        @apply w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
      }
    `,
  ],
})
export class PlaceholderComponent {
  @Input() title = "Coming Soon";
  @Input() description =
    "This feature is currently under development. We're working hard to bring you the best experience possible.";
  @Input() icon = "🚧";
  @Input() suggestions: { title: string; icon: string; link: string }[] = [
    { title: "Shop Products", icon: "🛍️", link: "/" },
    { title: "Categories", icon: "📂", link: "/" },
    { title: "Deals", icon: "💰", link: "/" },
  ];
}
