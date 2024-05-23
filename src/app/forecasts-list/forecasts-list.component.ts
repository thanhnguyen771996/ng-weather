import { Component } from "@angular/core";
import { WeatherService } from "../weather.service";
import { ActivatedRoute } from "@angular/router";
import { Forecast } from "./forecast.type";

@Component({
  selector: "app-forecasts-list",
  templateUrl: "./forecasts-list.component.html",
  styleUrls: ["./forecasts-list.component.css"],
})
export class ForecastsListComponent {
  zipcode: string;
  forecast: Forecast;

  constructor(protected weatherService: WeatherService, route: ActivatedRoute) {
    route.params.subscribe((params) => {
      this.zipcode = params.zipcode;
      const forecast = this.weatherService.storedForcast[this.zipcode];
      if (forecast && forecast.timestamp < Date.now() - 1000 * 60 * 60 * 2) {
        this.forecast = forecast.data;
      } else {
        weatherService.getForecast(this.zipcode).subscribe((data) => {
          this.forecast = data;
          this.weatherService.storedForcast = {
            ...this.weatherService.storedForcast,
            [this.zipcode]: {
              data: this.forecast,
              timestamp: Date.now(),
            },
          };
        });
      }
    });
  }
}
