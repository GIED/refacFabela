import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Product } from 'src/app/demo/domain/product';
import { ProductService } from 'src/app/demo/service/productservice';

@Component({
  selector: 'app-historial-producto',
  templateUrl: './historial-producto.component.html',
  styleUrls: ['./historial-producto.component.scss']
})
export class HistorialProductoComponent implements OnInit {
lineChartData:any;
lineChartOptions:any;
  products: Product[];
  lineData:any;
  lineOptions:any;

  constructor(private productService: ProductService, private messageService: MessageService,
    private confirmationService: ConfirmationService) { }

  ngOnInit() {
    this.productService.getProducts().then(data => this.products = data);

    this.lineData = {
      labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio'],
      datasets: [
          
          {
              label: 'Ventas del mes',
              data: [28, 48, 40, 19, 86, 27, 90],
              fill: false,
              backgroundColor: 'rgb(75, 192, 192)',
              borderColor: 'rgb(75, 192, 192)',
              tension: .4
          }
      ]
  };

  this.lineOptions = {
      plugins: {
          legend: {
              labels: {
                  fontColor: '#A0A7B5'
              }
          }
      },
      scales: {
          x: {
              ticks: {
                  color: '#A0A7B5'
              },
              grid: {
                  color:  'rgba(160, 167, 181, .3)',
              }
          },
          y: {
              ticks: {
                  color: '#A0A7B5'
              },
              grid: {
                  color:  'rgba(160, 167, 181, .3)',
              }
          },
      }
  };


  }

}
