import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { Product } from 'src/app/demo/domain/product';
import { ProductService } from 'src/app/demo/service/productservice';
import { TotalesGeneralesTablero } from '../model/TotalesGeneralesTablero';
import { TableroService } from '../../shared/service/tablero.service';

@Component({
  selector: 'app-tablero',
  templateUrl: './tablero.component.html',
  styleUrls: ['./tablero.component.scss']
})
export class TableroComponent implements OnInit {

  lineChartData: any;
  lineChartData2: any;

  lineChartOptions: any;

  dropdownYears: SelectItem[];
  dropdownYears2: SelectItem[];

  selectedYear: any;

  activeNews = 1;

  cars: any[];

  selectedCar: any;

  products: Product[];

  events: any[];

  //Esstos son los metodos que se tienen que quedar para la implementación definitiva
  toralesGeneralesTablero: TotalesGeneralesTablero;



  constructor(private productService: ProductService, private tableroService: TableroService) {
      this.toralesGeneralesTablero={};
     }

  ngOnInit() {


        this.tableroService.obtenerTotalesGeneralesTablero().subscribe(data =>{

            this.toralesGeneralesTablero=data;
            console.log(this.toralesGeneralesTablero);

        })



      this.productService.getProducts().then(data => this.products = data);

      this.lineChartData = {
          labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
          datasets: [
              {
                  label: 'Cotizaciones',
                  data: [1, 2, 5, 3, 12, 7, 15],
                  borderColor: [
                      'red'
                  ],
                  borderWidth: 3,
                  fill: false,
                  tension: .4
              },
              {
                  label: 'Ventas',
                  data: [3, 7, 2, 17, 15, 13, 19],
                  borderColor: [
                      'blue'
                  ],
                  borderWidth: 3,
                  fill: false,
                  tension: .4
              }
          ]
      };
      this.lineChartData2 = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
            {
                label: 'Mabiel',
                data: [2, 8, 5, 1, 20, 25, 15],
                borderColor: [
                    'purple'
                ],
                borderWidth: 3,
                fill: false,
                tension: .4
            },
            {
                label: 'Veronica',
                data: [7, 6, 5, 4, 3, 2, 1],
                borderColor: [
                    'green'
                ],
                borderWidth: 3,
                fill: false,
                tension: .4
            },
            {
              label: 'Cristian',
              data: [1, 2, 3, 4, 5, 6, 7],
              borderColor: [
                  'orange'
              ],
              borderWidth: 3,
              fill: false,
              tension: .4
          },
          {
            label: 'Jesus',
            data: [2, 3, 1, 10, 14, 15, 16],
            borderColor: [
                'blue'
            ],
            borderWidth: 3,
            fill: false,
            tension: .4
        }
        ]
    };
      this.lineChartOptions = {
          responsive: true,
          maintainAspectRatio: true,
          fontFamily: '\'Candara\', \'Calibri\', \'Courier\', \'serif\'',
          hover: {
              mode: 'index'
          },
          scales: {
              x: {
                  grid: {
                      display: false
                  },
                  ticks: {
                      color: '#1199a9'
                  }
              },
              y: {
                  grid: {
                      display: false
                  },
                  ticks: {
                      color: '#1199a9'
                  }
              }
          },
          plugins: {
              legend: {
                  display: true,
                  labels: {
                      color: '#1199a9'
                  }
              }
          }
      };

      this.dropdownYears = [
          {label: '2019', value: 2019},
          {label: '2018', value: 2018},
          {label: '2017', value: 2017},
          {label: '2016', value: 2016},
          {label: '2015', value: 2015},
          {label: '2014', value: 2014}
      ];
     
  }

}
