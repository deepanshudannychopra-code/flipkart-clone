import { Injectable, signal } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface DeliveryLocation {
  city: string;
  pincode: string;
  state: string;
  country: string;
  displayName: string;
}

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private currentLocation = signal<DeliveryLocation>({
    city: 'Mumbai',
    pincode: '400001',
    state: 'Maharashtra',
    country: 'India',
    displayName: 'Mumbai 400001'
  });

  // Popular cities in India for quick selection
  private popularCities: DeliveryLocation[] = [
    { city: 'Mumbai', pincode: '400001', state: 'Maharashtra', country: 'India', displayName: 'Mumbai 400001' },
    { city: 'Delhi', pincode: '110001', state: 'Delhi', country: 'India', displayName: 'Delhi 110001' },
    { city: 'Bangalore', pincode: '560001', state: 'Karnataka', country: 'India', displayName: 'Bangalore 560001' },
    { city: 'Hyderabad', pincode: '500001', state: 'Telangana', country: 'India', displayName: 'Hyderabad 500001' },
    { city: 'Chennai', pincode: '600001', state: 'Tamil Nadu', country: 'India', displayName: 'Chennai 600001' },
    { city: 'Kolkata', pincode: '700001', state: 'West Bengal', country: 'India', displayName: 'Kolkata 700001' },
    { city: 'Pune', pincode: '411001', state: 'Maharashtra', country: 'India', displayName: 'Pune 411001' },
    { city: 'Ahmedabad', pincode: '380001', state: 'Gujarat', country: 'India', displayName: 'Ahmedabad 380001' },
    { city: 'Jaipur', pincode: '302001', state: 'Rajasthan', country: 'India', displayName: 'Jaipur 302001' },
    { city: 'Surat', pincode: '395001', state: 'Gujarat', country: 'India', displayName: 'Surat 395001' }
  ];

  readonly location = this.currentLocation.asReadonly();

  constructor() {
    this.loadSavedLocation();
  }

  // Get current location using browser geolocation API
  getCurrentLocation(): Observable<DeliveryLocation> {
    if (!navigator.geolocation) {
      return of(this.currentLocation());
    }

    return from(
      new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 10000,
          enableHighAccuracy: false
        });
      })
    ).pipe(
      map((position) => {
        // In a real app, you would use reverse geocoding service
        // For demo, we'll use a mock location based on coordinates
        return this.getMockLocationFromCoordinates(
          position.coords.latitude,
          position.coords.longitude
        );
      }),
      catchError(() => {
        // If geolocation fails, return current location
        return of(this.currentLocation());
      })
    );
  }

  // Set delivery location
  setLocation(location: DeliveryLocation): void {
    this.currentLocation.set(location);
    this.saveLocationToStorage(location);
  }

  // Get popular cities for quick selection
  getPopularCities(): DeliveryLocation[] {
    return this.popularCities;
  }

  // Detect location by pincode (mock implementation)
  getLocationByPincode(pincode: string): Observable<DeliveryLocation | null> {
    return new Promise<DeliveryLocation | null>((resolve) => {
      setTimeout(() => {
        // Mock pincode lookup
        const mockLocations: { [key: string]: DeliveryLocation } = {
          '400001': { city: 'Mumbai', pincode: '400001', state: 'Maharashtra', country: 'India', displayName: 'Mumbai 400001' },
          '110001': { city: 'Delhi', pincode: '110001', state: 'Delhi', country: 'India', displayName: 'Delhi 110001' },
          '560001': { city: 'Bangalore', pincode: '560001', state: 'Karnataka', country: 'India', displayName: 'Bangalore 560001' },
          '500001': { city: 'Hyderabad', pincode: '500001', state: 'Telangana', country: 'India', displayName: 'Hyderabad 500001' },
          '600001': { city: 'Chennai', pincode: '600001', state: 'Tamil Nadu', country: 'India', displayName: 'Chennai 600001' },
          '700001': { city: 'Kolkata', pincode: '700001', state: 'West Bengal', country: 'India', displayName: 'Kolkata 700001' },
          '411001': { city: 'Pune', pincode: '411001', state: 'Maharashtra', country: 'India', displayName: 'Pune 411001' },
          '380001': { city: 'Ahmedabad', pincode: '380001', state: 'Gujarat', country: 'India', displayName: 'Ahmedabad 380001' },
          '302001': { city: 'Jaipur', pincode: '302001', state: 'Rajasthan', country: 'India', displayName: 'Jaipur 302001' },
          '395001': { city: 'Surat', pincode: '395001', state: 'Gujarat', country: 'India', displayName: 'Surat 395001' }
        };

        const location = mockLocations[pincode];
        resolve(location || null);
      }, 500);
    }) as any;
  }

  // Auto-detect location on app start
  autoDetectLocation(): void {
    this.getCurrentLocation().subscribe({
      next: (location) => {
        this.setLocation(location);
      },
      error: () => {
        // Keep default location if detection fails
        console.log('Location detection failed, using default location');
      }
    });
  }

  private getMockLocationFromCoordinates(lat: number, lng: number): DeliveryLocation {
    // Mock reverse geocoding - in real app use Google Maps or similar service
    // For demo, we'll return a location based on rough coordinates
    
    // Mumbai coordinates roughly
    if (lat >= 18.9 && lat <= 19.3 && lng >= 72.7 && lng <= 73.1) {
      return { city: 'Mumbai', pincode: '400001', state: 'Maharashtra', country: 'India', displayName: 'Mumbai 400001' };
    }
    
    // Delhi coordinates roughly
    if (lat >= 28.4 && lat <= 28.9 && lng >= 76.8 && lng <= 77.5) {
      return { city: 'Delhi', pincode: '110001', state: 'Delhi', country: 'India', displayName: 'Delhi 110001' };
    }
    
    // Bangalore coordinates roughly
    if (lat >= 12.8 && lat <= 13.2 && lng >= 77.4 && lng <= 77.8) {
      return { city: 'Bangalore', pincode: '560001', state: 'Karnataka', country: 'India', displayName: 'Bangalore 560001' };
    }
    
    // Default to Mumbai if can't determine
    return { city: 'Mumbai', pincode: '400001', state: 'Maharashtra', country: 'India', displayName: 'Mumbai 400001' };
  }

  private loadSavedLocation(): void {
    try {
      const saved = localStorage.getItem('flipkart_delivery_location');
      if (saved) {
        const location: DeliveryLocation = JSON.parse(saved);
        this.currentLocation.set(location);
      }
    } catch (error) {
      console.error('Error loading saved location:', error);
    }
  }

  private saveLocationToStorage(location: DeliveryLocation): void {
    try {
      localStorage.setItem('flipkart_delivery_location', JSON.stringify(location));
    } catch (error) {
      console.error('Error saving location:', error);
    }
  }
}
