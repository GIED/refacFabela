import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { Product } from 'src/app/demo/domain/product';
import { ProductService } from 'src/app/demo/service/productservice';
import { TotalesGeneralesTablero } from '../model/TotalesGeneralesTablero';
import { TableroService } from '../../shared/service/tablero.service';
import { VwVentaProductoAno } from '../model/VwVentraProductoAno';

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

   mes:string[];
   ventas:number[];
   cotizaciones:number[];
   ventaProductoAno:VwVentaProductoAno[];



  constructor(private productService: ProductService, private tableroService: TableroService) {
      this.toralesGeneralesTablero={};
      this.mes=[];
      this.cotizaciones=[];
      this.ventas=[];
     }

  ngOnInit() {

   
    const moonLanding = new Date();   
    this.obtenerVentasMesAno(moonLanding.getFullYear().toString());    
    this.obtenerTotalesGenerales();
    this.obtenerVentaProductoAno(moonLanding.getFullYear().toString());


      

      



      this.productService.getProducts().then(data => this.products = data);

    
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
       
        {label: '2023', value: 2023},
        {label: '2022', value: 2022},
        {label: '2021', value: 2021},
        {label: '2020', value: 2020},
        {label: '2019', value: 2019},
        {label: '2018', value: 2018},
         
      ];
     
  }

  consultarAno(){
    this.obtenerVentasMesAno(this.selectedYear);
    this.obtenerVentaProductoAno(this.selectedYear);
  }


  obtenerVentasMesAno(ano:string){
    this.mes=[];
    this.cotizaciones=[];
    this.ventas=[];

    this.tableroService.obtenerVentasMesAno(ano).subscribe(data=>{

        console.log(data);
    

        for (let index = 0; index < data.length; index++) {
            this.mes.push(data[index].sMes); 
            this.cotizaciones.push(data[index].nTotalCorizaciones);
            this.ventas.push(data[index].nTotalVentas);
            
        }

        this.lineChartData = {

          
            labels: this.mes,
            datasets: [
                {
                    label: 'Cotizaciones',
                    data: this.cotizaciones,
                    borderColor: [
                        'purple'
                    ],
                    borderWidth: 3,
                    fill: false,
                    tension: .4
                },
                {
                    label: 'Ventas',
                    data: this.ventas,
                    borderColor: [
                        'green'
                    ],
                    borderWidth: 3,
                    fill: false,
                    tension: .4
                }
            ]
        };

    });

  }

  obtenerTotalesGenerales(){

    this.tableroService.obtenerTotalesGeneralesTablero().subscribe(data =>{

        this.toralesGeneralesTablero=data;
        //console.log(this.toralesGeneralesTablero);

    })
  }


  obtenerVentaProductoAno(ano:string){
    this.ventaProductoAno=[];

    this.tableroService.obtenerVentasProductoAno(ano).subscribe(data=>{

        this.ventaProductoAno=data;

        

    });

  }
  

}
