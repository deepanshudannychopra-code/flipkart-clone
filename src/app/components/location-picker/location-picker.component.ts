import { Component, inject, signal, EventEmitter, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import {
  LocationService,
  DeliveryLocation,
} from "../../services/location.service";

@Component({
  selector: "app-location-picker",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div
      class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
    >
      <div
        class="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden"
      >
        <!-- Header -->
        <div
          class="bg-flipkart-blue text-white p-4 flex items-center justify-between"
        >
          <h3 class="text-lg font-semibold">Choose Delivery Location</h3>
          <button (click)="closeModal()" class="text-white hover:text-gray-200">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>

        <div class="p-4 overflow-y-auto max-h-[calc(90vh-80px)]">
          <!-- Auto-detect Location -->
          <div class="mb-6">
            <button
              (click)="detectLocation()"
              [disabled]="detecting()"
              class="w-full flex items-center justify-center space-x-2 p-3 border border-flipkart-blue text-flipkart-blue rounded-lg hover:bg-blue-50 disabled:opacity-50"
            >
              @if (detecting()) {
                <svg
                  class="animate-spin w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span>Detecting...</span>
              } @else {
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span>Use My Current Location</span>
              }
            </button>
          </div>

          <!-- Search by Pincode -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Enter Pincode</label
            >
            <div class="flex space-x-2">
              <input
                type="text"
                [(ngModel)]="searchPincode"
                placeholder="Enter 6-digit pincode"
                maxlength="6"
                class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-flipkart-blue"
                (keyup.enter)="searchByPincode()"
              />
              <button
                (click)="searchByPincode()"
                [disabled]="searchingPincode() || searchPincode().length !== 6"
                class="px-4 py-2 bg-flipkart-blue text-white rounded-md hover:bg-flipkart-blue/90 disabled:opacity-50"
              >
                @if (searchingPincode()) {
                  <svg
                    class="animate-spin w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                      clip-rule="evenodd"
                    />
                  </svg>
                } @else {
                  Search
                }
              </button>
            </div>
            @if (pincodeError()) {
              <p class="text-red-500 text-sm mt-1">{{ pincodeError() }}</p>
            }
          </div>

          <!-- Popular Cities -->
          <div>
            <h4 class="text-sm font-medium text-gray-700 mb-3">
              Popular Cities
            </h4>
            <div class="grid grid-cols-1 gap-2">
              @for (city of popularCities; track city.pincode) {
                <button
                  (click)="selectLocation(city)"
                  class="text-left p-3 border border-gray-200 rounded-lg hover:border-flipkart-blue hover:bg-blue-50 transition-colors"
                  [class.border-flipkart-blue]="
                    city.pincode === locationService.location().pincode
                  "
                  [class.bg-blue-50]="
                    city.pincode === locationService.location().pincode
                  "
                >
                  <div class="font-medium text-gray-900">{{ city.city }}</div>
                  <div class="text-sm text-gray-500">
                    {{ city.state }} - {{ city.pincode }}
                  </div>
                </button>
              }
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="p-4 border-t bg-gray-50">
          <div class="flex space-x-3">
            <button
              (click)="closeModal()"
              class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              (click)="confirmLocation()"
              class="flex-1 px-4 py-2 bg-flipkart-blue text-white rounded-md hover:bg-flipkart-blue/90"
            >
              Confirm Location
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class LocationPickerComponent {
  locationService = inject(LocationService);

  @Output() close = new EventEmitter<void>();
  @Output() locationSelected = new EventEmitter<DeliveryLocation>();

  searchPincode = signal("");
  detecting = signal(false);
  searchingPincode = signal(false);
  pincodeError = signal("");

  popularCities = this.locationService.getPopularCities();

  detectLocation(): void {
    this.detecting.set(true);
    this.locationService.getCurrentLocation().subscribe({
      next: (location) => {
        this.detecting.set(false);
        this.selectLocation(location);
      },
      error: () => {
        this.detecting.set(false);
        this.pincodeError.set(
          "Could not detect location. Please select manually.",
        );
      },
    });
  }

  searchByPincode(): void {
    const pincode = this.searchPincode().trim();
    if (pincode.length !== 6) {
      this.pincodeError.set("Please enter a valid 6-digit pincode");
      return;
    }

    this.searchingPincode.set(true);
    this.pincodeError.set("");

    this.locationService.getLocationByPincode(pincode).subscribe({
      next: (location) => {
        this.searchingPincode.set(false);
        if (location) {
          this.selectLocation(location);
        } else {
          this.pincodeError.set("Location not found for this pincode");
        }
      },
      error: () => {
        this.searchingPincode.set(false);
        this.pincodeError.set("Error searching location. Please try again.");
      },
    });
  }

  selectLocation(location: DeliveryLocation): void {
    this.locationService.setLocation(location);
  }

  confirmLocation(): void {
    this.locationSelected.emit(this.locationService.location());
    this.closeModal();
  }

  closeModal(): void {
    this.close.emit();
  }
}
