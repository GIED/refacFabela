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
import { VentasService } from '../../../shared/service/ventas.service';
import { TvVentaProductoMes } from '../../model/TvVentaProductoMes';
import { TwHistoriaIngresoProducto } from '../../model/TwHistoriaIngresoProducto';
import { TwVentasProducto } from '../../model/TwVentasProducto';
import { TvStockProducto } from '../../model/TvStockProducto';
import { HistoriaIngresoProducto } from '../../model/HistoriaIngresoProducto';

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
  mostrarHistoriaStockProducto:boolean=false;
  nIdProductoConsulta:number;

  //Objetos para tabla de productos por bodega
  listaProductoBodega: TwProductoBodega[];
  stockTotal:number=0;
  traspaso:boolean=false;
  //Objetos de gráfica de producto por  bodega
  laberProductoBodega: string[];
  dataProductoBodega:number[];
  productoBodegaGraf:any;
  pieOptions:any;

  //objetos tabla Venta de productos por mes

  listaProductosVentaMes:TvVentaProductoMes[];
  laberProductoVentaMes: string[];
  dataProductoVentaMes:number[];
  ventaProductoMesGraf:any;

  //objetos de ingreso de producto

  listaIngresoProducto: HistoriaIngresoProducto[];

  //lista de ventas del producto

  listaVentasProducto:TwVentasProducto[];



  constructor(private productService: ProductService, private messageService: MessageService,
    private confirmationService: ConfirmationService, private spinner: NgxSpinnerService, private productosService:ProductoService, private bodegasService:BodegasService, private ventasService:VentasService) {
        this.labelsHistoriaIngresoProducto=[];
        this.dataHistoriaIngresoProducto=[];
        this.laberProductoBodega=[];
        this.dataProductoBodega=[];
        this.listaProductosVentaMes=[];
        this.laberProductoVentaMes=[];
        this.dataProductoVentaMes=[];
        this.dataHistoriaIngresoProducto=[];
        this.listaVentasProducto=[];
        this.productoDetalle=new TvProductoDetalle();   
      
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

  limpiar(){
    // Limpiar arrays de labels y datos para gráficas
    this.labelsHistoriaIngresoProducto = [];
    this.dataHistoriaIngresoProducto = [];
    this.laberProductoBodega = [];
    this.dataProductoBodega = [];  
    this.laberProductoVentaMes = [];      
    this.dataProductoVentaMes = [];
    
    // Limpiar listas de datos
    this.listaHistoriaPrecioProducto = [];
    this.listaProductoBodega = [];
    this.listaProductosVentaMes = [];
    this.listaIngresoProducto = [];
    this.listaVentasProducto = [];
    
    // Limpiar objetos de gráficas
    this.historiaIngresoGraf = null;
    this.productoBodegaGraf = null;
    this.ventaProductoMesGraf = null;
    
    // Resetear producto detalle y stock
    this.productoDetalle = new TvProductoDetalle();
    this.stockTotal = 0;
    
    // Resetear banderas
    this.cargaInicial = false;
  }

//se obtine la hsitoria de ingreso del producto  
informacionProducto(nId:number) {
    
    this.limpiar();
    
  

    this.nIdProductoConsulta=nId;
  
    //Consulta de historia de precios del producto
    let historia= this.productosService.historiaPrecioProducto(nId);
    //Consulta de datos generales del producto
    let detalleProductos=this.productosService.obtenerTotalBodegasIdProducto(nId)
    //Consulta de producto por bodegas
    let productoBodegas=  this.bodegasService.obtenerProductoBodegas(nId);
  // consulat de historia de ingreso del producto
    let historiaIngreso=this.productosService.historiaIngresoDelProducto(nId)
  //Consulta de ventas del producto por mes
    let ventaMesProducto= this.ventasService.obtenerProductoVentaMesId(nId);
   // consulta de ventas del producto     
   let ventasProducto=this.ventasService.obtenerProductoVenta(nId);
   




    
    //hace la consulta en orden y espera a realizar la recarga hasta que llegen todas las peticiones
    forkJoin([
        historia,detalleProductos,productoBodegas, ventaMesProducto, historiaIngreso, ventasProducto 
      ]).subscribe(resultado => {
        this.listaHistoriaPrecioProducto=resultado[0]    
        this.productoDetalle=new TvProductoDetalle(); 
        this.productoDetalle=resultado[1];

        for(const key2 in  this.listaHistoriaPrecioProducto){
         
            let fecha = new Date(this.listaHistoriaPrecioProducto[key2].dFecha);

            fecha.setDate(fecha.getDate() + 1);
      
            this.listaHistoriaPrecioProducto[key2].dFecha=fecha;
        }


        this.listaProductoBodega =resultado[2];
        for (const key in resultado[2]) {
            this.stockTotal += this.listaProductoBodega[key].nCantidad;
        }
        this.listaProductosVentaMes=resultado[3];
       
        this.cargaInicial=true;

        this.listaIngresoProducto=resultado[4];
       // console.log(resultado[4]);
        this.listaVentasProducto=resultado[5];

        this.graficaHistoriaPrecioProducto(this.listaHistoriaPrecioProducto);
        this.graficaproductoBodegas(this.listaProductoBodega);
        this.graficaVentasMes(this.listaProductosVentaMes);

      })  

}

graficaHistoriaPrecioProducto(listaHistoriaPrecioProducto?:TcHistoriaPrecioProducto[]){ 
   
    for (let index = 0; index < listaHistoriaPrecioProducto.length; index++) {
        let fecha=new Date(listaHistoriaPrecioProducto[index].dFecha);   
   
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
graficaVentasMes(listaProductosVentaMes?:TvVentaProductoMes[]){ 
   
    for (let index = 0; index < listaProductosVentaMes.length; index++) {
       
       
        this.laberProductoVentaMes.push(listaProductosVentaMes[index].fechaVenta);      
        this.dataProductoVentaMes.push(listaProductosVentaMes[index].cantidad);
        
    }
    this.ventaProductoMesGraf = {
        labels: this.laberProductoVentaMes,
        datasets: [
            
            {
                label: 'Productos Vendidos por mes',
                data: this.dataProductoVentaMes,
                fill: false,
                backgroundColor: 'purple',
                borderColor: 'purple',
                tension: .4
            }
        ]
    };
}

}
