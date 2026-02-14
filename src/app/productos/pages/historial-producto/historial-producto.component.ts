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
import { InventarioUbicacionService } from '../../../almacen/service/inventario-ubicacion.service';
import { InventarioUbicacionDto } from '../../../almacen/model/InventarioUbicacionDto';

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
  labelsIngresoProducto: string[];
  dataIngresoProducto: number[];
  ingresoProductoGraf: any;

  //lista de ventas del producto

  listaVentasProducto:TwVentasProducto[];
  labelsVentasProducto: string[];
  dataVentasProducto: number[];
  ventasProductoGraf: any;

  //lista de inventarios del producto
  listaInventariosProducto: InventarioUbicacionDto[] = [];



  constructor(private productService: ProductService, private messageService: MessageService,
    private confirmationService: ConfirmationService, private spinner: NgxSpinnerService, private productosService:ProductoService, private bodegasService:BodegasService, private ventasService:VentasService, private inventarioUbicacionService: InventarioUbicacionService) {
        this.labelsHistoriaIngresoProducto=[];
        this.dataHistoriaIngresoProducto=[];
        this.laberProductoBodega=[];
        this.dataProductoBodega=[];
        this.listaProductosVentaMes=[];
        this.laberProductoVentaMes=[];
        this.dataProductoVentaMes=[];
        this.dataHistoriaIngresoProducto=[];
        this.listaVentasProducto=[];
        this.labelsVentasProducto=[];
        this.dataVentasProducto=[];
        this.labelsIngresoProducto=[];
        this.dataIngresoProducto=[];
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
      maintainAspectRatio: true,
      aspectRatio: 2,
      responsive: true,
      plugins: {
          legend: {
              labels: {
                  color: '#A0A7B5'
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
    this.labelsVentasProducto = [];
    this.dataVentasProducto = [];
    this.labelsIngresoProducto = [];
    this.dataIngresoProducto = [];
    this.listaInventariosProducto = [];
    
    // Limpiar objetos de gráficas
    this.historiaIngresoGraf = null;
    this.productoBodegaGraf = null;
    this.ventaProductoMesGraf = null;
    this.ventasProductoGraf = null;
    this.ingresoProductoGraf = null;
    
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
   // consulta de inventarios del producto
   let inventariosProducto=this.inventarioUbicacionService.consultarInventariosPorProducto(nId);
   




    
    //hace la consulta en orden y espera a realizar la recarga hasta que llegen todas las peticiones
    forkJoin([
        historia,detalleProductos,productoBodegas, ventaMesProducto, historiaIngreso, ventasProducto, inventariosProducto 
      ]).subscribe(resultado => {
        this.listaHistoriaPrecioProducto=resultado[0] as TcHistoriaPrecioProducto[];    
        this.productoDetalle=new TvProductoDetalle(); 
        this.productoDetalle=resultado[1] as TvProductoDetalle;

        for(const key2 in  this.listaHistoriaPrecioProducto){
         
            let fecha = new Date(this.listaHistoriaPrecioProducto[key2].dFecha);

            fecha.setDate(fecha.getDate() + 1);
      
            this.listaHistoriaPrecioProducto[key2].dFecha=fecha;
        }


        this.listaProductoBodega =resultado[2] as TwProductoBodega[];
        for (const key in resultado[2]) {
            this.stockTotal += this.listaProductoBodega[key].nCantidad;
        }
        this.listaProductosVentaMes=resultado[3] as TvVentaProductoMes[];
       
        this.cargaInicial=true;

        this.listaIngresoProducto=resultado[4] as HistoriaIngresoProducto[];
       // console.log(resultado[4]);
        this.listaVentasProducto=resultado[5] as TwVentasProducto[];

        this.listaInventariosProducto=resultado[6] as InventarioUbicacionDto[];

        this.graficaHistoriaPrecioProducto(this.listaHistoriaPrecioProducto);
        this.graficaproductoBodegas(this.listaProductoBodega);
        this.graficaVentasMes(this.listaProductosVentaMes);
        this.graficaVentasProducto(this.listaVentasProducto);
        this.graficaIngresoProducto(this.listaIngresoProducto);

      })  

}

graficaHistoriaPrecioProducto(listaHistoriaPrecioProducto?: TcHistoriaPrecioProducto[]): void {

  // Limpia para que no se acumulen datos si vuelves a llamar el método
  this.labelsHistoriaIngresoProducto = [];
  this.dataHistoriaIngresoProducto = [];

  if (!listaHistoriaPrecioProducto?.length) {
    // Si quieres, deja la gráfica vacía
    this.historiaIngresoGraf = { labels: [], datasets: [] };
    return;
  }

  // (Opcional) Ordena por fecha ascendente para que la línea tenga sentido
  const ordenada = [...listaHistoriaPrecioProducto].sort((a, b) => {
    const fa = new Date(a.dFecha as any).getTime();
    const fb = new Date(b.dFecha as any).getTime();
    return fa - fb;
  });

  for (let i = 0; i < ordenada.length; i++) {
    const item = ordenada[i];
    const fecha = new Date(item.dFecha as any);

    const dd = String(fecha.getDate()).padStart(2, '0');
    const mm = String(fecha.getMonth() + 1).padStart(2, '0'); // +1 porque enero = 0
    const yyyy = fecha.getFullYear();

    this.labelsHistoriaIngresoProducto.push(`${dd}/${mm}/${yyyy}`);
    this.dataHistoriaIngresoProducto.push(Number(item.nPrecio ?? 0));
  }

  this.historiaIngresoGraf = {
    labels: this.labelsHistoriaIngresoProducto,
    datasets: [
      {
        label: 'Historial de precio del producto',
        data: this.dataHistoriaIngresoProducto,
        fill: false,
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 2,
        pointHoverRadius: 4
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
        maintainAspectRatio: true,
        aspectRatio: 1.5,
        responsive: true,
        plugins: {
            legend: {
                labels: {
                    color: '#A0A7B5'
                },
                position: 'bottom'
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

graficaVentasProducto(listaVentasProducto?: TwVentasProducto[]): void {
    // Limpiar arrays previos
    this.labelsVentasProducto = [];
    this.dataVentasProducto = [];

    if (!listaVentasProducto?.length) {
        this.ventasProductoGraf = { labels: [], datasets: [] };
        return;
    }

    // Ordenar por fecha de venta
    const ordenada = [...listaVentasProducto].sort((a, b) => {
        const fa = new Date(a.twVenta.dFechaVenta as any).getTime();
        const fb = new Date(b.twVenta.dFechaVenta as any).getTime();
        return fa - fb;
    });

    // Tomar las últimas 15 ventas para que la gráfica no se sature
    const ventasRecientes = ordenada.slice(-15);

    for (let i = 0; i < ventasRecientes.length; i++) {
        const venta = ventasRecientes[i];
        const fecha = new Date(venta.twVenta.dFechaVenta as any);
        const fechaFormateada = `${fecha.getDate()}/${fecha.getMonth() + 1}/${fecha.getFullYear()}`;
        
        this.labelsVentasProducto.push(fechaFormateada);
        this.dataVentasProducto.push(venta.nCantidad);
    }

    this.ventasProductoGraf = {
        labels: this.labelsVentasProducto,
        datasets: [
            {
                label: 'Cantidad Vendida',
                data: this.dataVentasProducto,
                fill: true,
                backgroundColor: 'rgba(239, 68, 68, 0.2)',
                borderColor: '#EF4444',
                tension: .4,
                pointBackgroundColor: '#EF4444',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: '#EF4444',
                pointRadius: 5,
                pointHoverRadius: 7
            }
        ]
    };
}

graficaIngresoProducto(listaIngresoProducto?: HistoriaIngresoProducto[]): void {
    // Limpiar arrays previos
    this.labelsIngresoProducto = [];
    this.dataIngresoProducto = [];

    if (!listaIngresoProducto?.length) {
        this.ingresoProductoGraf = { labels: [], datasets: [] };
        return;
    }

    // Ordenar por fecha de ingreso
    const ordenada = [...listaIngresoProducto].sort((a, b) => {
        const fa = new Date(a.dFechaIngreso as any).getTime();
        const fb = new Date(b.dFechaIngreso as any).getTime();
        return fa - fb;
    });

    // Tomar los últimos 15 ingresos para que la gráfica no se sature
    const ingresosRecientes = ordenada.slice(-15);

    for (let i = 0; i < ingresosRecientes.length; i++) {
        const ingreso = ingresosRecientes[i];
        const fecha = new Date(ingreso.dFechaIngreso as any);
        const fechaFormateada = `${fecha.getDate()}/${fecha.getMonth() + 1}/${fecha.getFullYear()}`;
        
        this.labelsIngresoProducto.push(fechaFormateada);
        this.dataIngresoProducto.push(ingreso.nCantidad);
    }

    this.ingresoProductoGraf = {
        labels: this.labelsIngresoProducto,
        datasets: [
            {
                label: 'Cantidad Ingresada',
                data: this.dataIngresoProducto,
                fill: true,
                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                borderColor: '#10B981',
                tension: .4,
                pointBackgroundColor: '#10B981',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: '#10B981',
                pointRadius: 5,
                pointHoverRadius: 7
            }
        ]
    };
}

}
