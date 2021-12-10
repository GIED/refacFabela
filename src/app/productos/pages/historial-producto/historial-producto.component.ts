import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Product } from 'src/app/demo/domain/product';
import { ProductService } from 'src/app/demo/service/productservice';
import { NgxSpinnerService } from 'ngx-spinner';
import { TcHistoriaPrecioProducto } from '../../model/TcHistoriaPrecioProducto';
import { ProductoService } from 'src/app/shared/service/producto.service';
import { TvProductoDetalle } from '../../model/TvProductoDetalle';
import { forkJoin } from 'rxjs';
import { BodegasService } from '../../../shared/service/bodegas.service';
import { TwProductoBodega } from '../../model/TwProductoBodega';

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
  historiaIngresoGraf:any;
  lineOptions:any;
  listaHistoriaPrecioProducto: TcHistoriaPrecioProducto[];
  productoDetalle:TvProductoDetalle;
  cargaInicial:boolean=true;
  labelsHistoriaIngresoProducto:string[];
  dataHistoriaIngresoProducto:number[];

  //Objetos para tabla de productos por bodega
  listaProductoBodega: TwProductoBodega[];
  stockTotal:number=0;
  traspaso:boolean=false;
  //Objetos de gráfica de producto por  bodega
  laberProductoBodega: string[];
  dataProductoBodega:number[];
  productoBodegaGraf:any;
  pieOptions:any;



  constructor(private productService: ProductService, private messageService: MessageService,
    private confirmationService: ConfirmationService, private spinner: NgxSpinnerService, private productosService:ProductoService, private bodegasService:BodegasService) {
        this.labelsHistoriaIngresoProducto=[];
        this.dataHistoriaIngresoProducto=[];
        this.laberProductoBodega=[];
        this.dataProductoBodega=[];
      
     }

  ngOnInit() {
    this.cargaInicial=false;
       
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

//se obtine la hsitoria de ingreso del producto  
informacionProducto(nId:number) {
    this.labelsHistoriaIngresoProducto=[];
    this.dataHistoriaIngresoProducto=[];


    console.log("llegue"+ nId);

  
    //Consulta de historia de precios del producto
    let historia= this.productosService.historiaPrecioProducto(nId);
    //Consulta de datos generales del producto
    let detalleProducto=this.productosService.obtenerTotalBodegasIdProducto(nId)
    //Consulta de producto por bodegas
    let productoBodegas=  this.bodegasService.obtenerProductoBodegas(nId);
    
    //hace la consulta en orden y espera a realizar la recarga hasta que llegen todas las peticiones
    forkJoin([
        historia,detalleProducto,productoBodegas
      ]).subscribe(resultado => {
        this.listaHistoriaPrecioProducto=resultado[0]       
        this.productoDetalle=resultado[1];
        this.listaProductoBodega =resultado[2];
        for (const key in resultado[2]) {
            this.stockTotal += this.listaProductoBodega[key].nCantidad;
        }
        this.cargaInicial=true;
        this.graficaHistoriaPrecioProducto(this.listaHistoriaPrecioProducto);
        this.graficaproductoBodegas(this.listaProductoBodega);
      })  

}

graficaHistoriaPrecioProducto(listaHistoriaPrecioProducto?:TcHistoriaPrecioProducto[]){ 
   
    for (let index = 0; index < listaHistoriaPrecioProducto.length; index++) {
        let fecha=new Date(listaHistoriaPrecioProducto[index].dFecha);   
        console.log(fecha.getDate());   
        this.labelsHistoriaIngresoProducto.push(fecha.getDate()+'/'+fecha.getMonth()+'/'+fecha.getFullYear());      
        this.dataHistoriaIngresoProducto.push(listaHistoriaPrecioProducto[index].nPrecio);
        
    }
    this.historiaIngresoGraf = {
        labels: this.labelsHistoriaIngresoProducto,
        datasets: [
            
            {
                label: 'Historia de ingreso del producto',
                data: this.dataHistoriaIngresoProducto,
                fill: false,
                backgroundColor: 'rgb(75, 192, 192)',
                borderColor: 'rgb(75, 192, 192)',
                tension: .4
            }
        ]
    };


}
graficaproductoBodegas(listaProductoBodega?:TwProductoBodega[]){ 
   
    for (let index = 0; index < listaProductoBodega.length; index++) {
      
        this.laberProductoBodega.push(listaProductoBodega[index].tcBodega.sBodega);      
        this.dataProductoBodega.push(listaProductoBodega[index].nCantidad);
        
    }
    console.log("Lable de grafica"+this.laberProductoBodega);
    console.log("data de grafica"+this.dataProductoBodega);

    this.productoBodegaGraf = {
        labels: this.laberProductoBodega,
        datasets: [
            
            {
                label: 'Producto por Bodega',
                data: this.dataProductoBodega,
                fill: true,               
               
                tension: .4,
                hoverBackgroundColor: [
                    "#64B5F6",
                    "#81C784",
                    "#FFB74D"
                ],
                backgroundColor: [
                    "#42A5F5",
                    "#66BB6A",
                    "#FFA726"
                ]
            }
        ]
    };
    this.pieOptions = {
        plugins: {
            legend: {
                labels: {
                    fontColor: '#A0A7B5'
                },
                
            }
        },
      
    };


}


}
