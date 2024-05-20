import { Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { WeatherService } from "./weather.service";
import { BehaviorSubject } from 'rxjs';

export const LOCATIONS: string = "locations";

@Injectable()
export class LocationService {

  locations$ = new BehaviorSubject<string[]>(this.storedLocations);

  private get storedLocations() {
    let locString = localStorage.getItem(LOCATIONS);
    if (locString) {
      return JSON.parse(locString) as string[];
    }
    return []
  }

  private set storedLocations(value: string[]) {
    localStorage.setItem(LOCATIONS, value.toString());
  }

  constructor(private weatherService: WeatherService) {
    this.locations$.pipe(
      takeUntilDestroyed()
    ).subscribe(locations => {
      this.storedLocations = locations;
    });
  }

  addLocation(zipcode: string) {
    this.weatherService.addCurrentConditions(zipcode);
    this.locations$.next([...this.locations$.value, zipcode]);
  }

  removeLocation(zipcode: string) {
    this.locations$.next([...this.locations$.value.filter(z => z !== zipcode), zipcode]);
    this.weatherService.removeCurrentConditions(zipcode);

  }
}
