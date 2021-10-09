import { SelectItem } from 'primeng/api';
import { Component, OnInit } from '@angular/core';
import { CountryService } from 'src/app/demo/service/countryservice';

@Component({
  selector: 'app-tipo-cambio',
  templateUrl: './tipo-cambio.component.html',
  styles: [`:host ::ng-deep .p-multiselect {
		min-width: 15rem;
	}

	:host ::ng-deep .multiselect-custom-virtual-scroll .p-multiselect {
		min-width: 20rem;
	}

	:host ::ng-deep .multiselect-custom .p-multiselect-label {
		padding-top: .25rem;
		padding-bottom: .25rem;

	}


	:host ::ng-deep .multiselect-custom .country-item.country-item-value {
		padding: .25rem .5rem;
		border-radius: 3px;
		display: inline-flex;
		margin-right: .5rem;
		background-color: var(--primary-color);
		color: var(--primary-color-text);
	}

	:host ::ng-deep .multiselect-custom .country-item.country-item-value img.flag {
		width: 17px;
	}

	:host ::ng-deep .multiselect-custom .country-item {
		display: flex;
		align-items: center;
	}

	:host ::ng-deep .multiselect-custom .country-item img.flag {
		width: 18px;
		margin-right: .5rem;
	}

	:host ::ng-deep .multiselect-custom .country-placeholder {
		padding: 0.25rem;
	}

	:host ::ng-deep .p-colorpicker {
		width: 2.5em
	}
    `]
})
export class TipoCambioComponent implements OnInit {

  countries: any[];

  filteredCountries: any[];

  selectedCountryAdvanced: any[];

  valSlider = 50;

  valColor = '#424242';

  valRadio: string;

  valCheck: string[] = [];

  valSwitch: boolean;

  cities: SelectItem[];

  selectedList: SelectItem;

  selectedDrop: SelectItem;

  selectedMulti: string[] = [];

  valToggle = false;

  paymentOptions: any[];

  valSelect1: string;

  valSelect2: string;

  valueKnob = 20;

  constructor( ) {
     
  }

  ngOnInit() {
      
  }

  

}
