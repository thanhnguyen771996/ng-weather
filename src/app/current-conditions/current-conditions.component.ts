import { Component, computed, inject, signal, Signal, TemplateRef, ViewChild } from '@angular/core';
import { WeatherService } from "../weather.service";
import { Router } from "@angular/router";
import { ConditionsAndZip } from '../conditions-and-zip.type';
import { Item } from 'app/tabs/tabs.component';

@Component({
  selector: 'app-current-conditions',
  templateUrl: './current-conditions.component.html',
  styleUrls: ['./current-conditions.component.css'],
})
export class CurrentConditionsComponent {
  selectedTabZipCode = signal<string>('');
  @ViewChild('tabHeader', {
    static: true
  }) tabHeader: TemplateRef<{
    item: ConditionsAndZip
  }>;
  @ViewChild('tabContent', {
    static: true
  }) tabContent: TemplateRef<{
    item: ConditionsAndZip
  }>;
  protected weatherService = inject(WeatherService);
  private router = inject(Router);
  protected currentConditionsByZip: Signal<ConditionsAndZip[]> = this.weatherService.getCurrentConditions();
  protected currentConditionsDisplay = computed(() => this.currentConditionsByZip().map<Item<ConditionsAndZip>>(location => ({
    data: location,
    id: location.zip,
    headerRef: this.tabHeader,
    contentRef: this.tabContent
  })));
  showForecast(zipcode: string) {
    this.router.navigate(['/forecast', zipcode])
  }

}
