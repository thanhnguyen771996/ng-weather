import { Component } from '@angular/core';
import { WeatherService } from 'app/weather.service';

@Component({
  selector: 'app-zipcode-entry',
  templateUrl: './zipcode-entry.component.html'
})
export class ZipcodeEntryComponent {

  constructor(private service: WeatherService) { }

  addLocation(zipcode: string) {
    this.service.addCurrentConditions(zipcode);
  }

}
