import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { locator } from 'src/app/shared/sesion/locator';
import { environment } from 'src/environments/environment';
import { VwMetaProductoCompra } from '../../model/VwMetaProductoCompra';
import { ComprasService } from '../../../shared/service/compras.service';
import { MessageModule } from 'primeng/message';
import { ConfirmationService, MessageService } from 'primeng/api';
import { VenCotProdAnoDto } from '../../model/VenCotProdAnoDto';
import { ProveedorService } from '../../../administracion/service/proveedor.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Proveedores } from 'src/app/administracion/interfaces/proveedores';
import { TcProducto } from '../../model/TcProducto';
import { ProductoService } from 'src/app/shared/service/producto.service';
import { UsuarioComponent } from '../../../administracion/pages/usuario/usuario.component';
import { TokenService } from 'src/app/shared/service/token.service';
import { TwCarritoCompraPedido } from '../../model/TwCarritoCompraPedido';
import { PedidosService } from 'src/app/shared/service/pedidos.service';
import { PedidoDto } from '../../model/PedidoDto';
import { TwPedidoProducto } from '../../model/TwPedidoProducto';
import { forkJoin, Observable } from 'rxjs';
import { TvPedidoDetalle } from '../../model/TvPedidoDetalle';
import { TwVentasProducto } from '../../model/TwVentasProducto';
import { VentasService } from 'src/app/shared/service/ventas.service';

@Component({
  selector: 'app-compras-producto',
  templateUrl: './compras-producto.component.html',
  styleUrls: ['./compras-producto.component.scss']
})


export class ComprasProductoComponent implements OnInit {

  datosRecibidos: { fechaInicio: string; fechaTermino: string } | null = null;
  listaProductosUltimaCompra: VwMetaProductoCompra[];
  vwMetaProductoCompra: VwMetaProductoCompra;
  dialogo: boolean;
  listaAnoVentaCot: VenCotProdAnoDto[];
  lineChartData2: any
  lineChartOptions: any;
  ano: string[];
  ventas: number[];
  cotizaciones: number[];
  form: FormGroup;
  filteredProveedores: Proveedores[];
  proveedorSeleccionado: Proveedores;
  totalVentas: number;
  totalCotizaciones: number;
  efectividad: number;
  producto: TcProducto;  
  productDialog: boolean;
  titulo: string;
  listaTwCarritoCompraPedido: TwPedidoProducto[];
  twPedidoProducto: TwPedidoProducto;
  pedidoDto: PedidoDto;
  twPedidoProductoDto: TwPedidoProducto;
  displayDialog: boolean = false;
  pedidoGuardado:number;
  cols: any[];
  listaPedidoDetalle:TvPedidoDetalle[];
  listaPedidos:TwPedidoProducto[];
  detalleDialog: boolean = false;
  banMustraVentasProducto:boolean=false;
  listaVentasProducto:TwVentasProducto[];
  existingProduct:TwPedidoProducto;
  
  


  constructor(private comprasService: ComprasService, private messageService: MessageService, private proveedorService: ProveedorService, private fb: FormBuilder, private productosService: ProductoService,
    private tokenService: TokenService, private confirmationService: ConfirmationService, private pedidosService: PedidosService, private ventasService:VentasService

  ) {
    this.datosRecibidos = null;
    this.listaProductosUltimaCompra = [];
    this.vwMetaProductoCompra = new VwMetaProductoCompra();
    this.dialogo = false;
    this.listaAnoVentaCot = [];
    this.ano = [];
    this.ventas = [];
    this.cotizaciones = [];
    this.proveedorSeleccionado = null;
    this.totalVentas = 0;
    this.totalCotizaciones = 0;
    this.efectividad = 0;
    this.productDialog = false;
    this.titulo = null;
    this.listaTwCarritoCompraPedido = [];
    this.pedidoDto = new PedidoDto();
    this.twPedidoProductoDto = new TwPedidoProducto();
    this.twPedidoProducto= new TwPedidoProducto();
    this.listaVentasProducto=[];
    this.existingProduct=new TwPedidoProducto();
   
    this.cols = [
      { field: 'tcProducto.sNoParte', header: 'No Parte' },
      { field: 'tcProducto.sProducto', header: 'Producto' },
      { field: 'tcProducto.sMarca', header: 'Marca' },
      { field: 'dFechaPedido', header: 'Fecha Registro' },
      { field: 'nCantidadPedida', header: 'Cantidad' },
      { field: 'tcProveedore.sRazonSocial', header: 'Proveedor' }
    ];





  }

  ngOnInit(): void {
    const today = new Date();
    // CREA EL FORMULARIO DE REGISTRO DE PEDIDO PRODUCTO
    this.form = this.fb.group({
      proveedor: [null, Validators.required],
      cantidad: [null, [Validators.required, Validators.pattern('^[0-9]*$')]]
    });

    /*SE CONSULTAN LAS LISTAS DE PRODUCTOS VENDIDOS DEL DIA Y LA LISTA O CARRIO DE COMPRA PENDIENTE DE PEDIR*/
    const consulta1 = this.getProductosUltimaFechaCompra(today.toISOString().split('T')[0], today.toISOString().split('T')[0]);
    const consulta2 = this.consultaCarritoCompraPedido(this.tokenService.getIdUser());
    const consulta3 = this.obtenerTodosPedidos();
     
    
    /* SE ESPERA A QUE REGRESEN DE CONSULTAR AMBOS SERVCIOS PARA BUSCAR LOS PRODUCTOS QUE ESTAN AGREGADOS EN LA LISTA */
    forkJoin([consulta1, consulta2, consulta3]).subscribe((data1) => {       
      /*SE ASIGNAL LOS VALORES DE LOS SERVICIOS A LAS LISTAS*/
      this.listaProductosUltimaCompra = data1[0]
      this.listaTwCarritoCompraPedido = data1[1];
      this.listaPedidoDetalle=data1[2];     

       /*SE PINTAN LOS PRODUCTOS AGREGADOS AL CARRITO DE COMPRAS*/
       this.obtenerTodosPedidos();
      this.listaProductosUltimaCompra = this.marcarProductosAgrgadosCarrito(data1[0], data1[1]);
    },
      error => {
        console.error('Error en las consultas:', error);
      }
    );
  }

  marcarProductosAgrgadosCarrito(listaVendidos: VwMetaProductoCompra[], listaCarrito: TwPedidoProducto[]) {
    listaVendidos.forEach(productoAgregado => {
      const productoEnCarrito = listaCarrito.find(productoCarrito => productoCarrito.nIdProducto === productoAgregado.nId);
      if (productoEnCarrito) {
        productoAgregado.nAgregado = true;
      } else {
        productoAgregado.nAgregado = false;
      }
    }); 
    return (listaVendidos)
  }

  confirm() {
    this.confirmationService.confirm({
      message: '¿Estás seguro de que deseas generar el pedido? Una vez generado, no podrás agregar más productos al pedido.',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Aceptar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.guardarPedido();
      }
    });
  }

 guardarPedido() {
  // Llenar el objeto para guardar el pedido en pedidos
  this.pedidoDto.nId = null;
    this.pedidoDto.nIdUsuario = this.tokenService.getIdUser();
    this.pedidoDto.nEstatus = 0;
    this.pedidoDto.sCvePedido = this.generarClavePedido();
    this.pedidoDto.dFechaPedido = new Date();
    this.pedidoDto.twPedidoProducto=[];

  // Llenar la lista de productos del pedido
  this.listaTwCarritoCompraPedido.forEach(item => {
    const twPedidoProductoDto = new TwPedidoProducto();
    twPedidoProductoDto.nId=item.nId;
    twPedidoProductoDto.nIdProducto = item.nIdProducto;
    twPedidoProductoDto.nMotivoPedido = 1;
    twPedidoProductoDto.nCantidadPedida = item.nCantidadPedida;
    twPedidoProductoDto.nIdProveedor = item.nIdProveedor;
    twPedidoProductoDto.nEstatus = 2;
    twPedidoProductoDto.nIdUsuario = this.tokenService.getIdUser();
    twPedidoProductoDto.sClavePedido = this.generarClavePedido();
    twPedidoProductoDto.nCantidaRecibida=0;

    this.pedidoDto.twPedidoProducto.push(twPedidoProductoDto);
  });

  // Guardar el pedido
  this.pedidosService.guardaPedido(this.pedidoDto).subscribe(data => {
    // Asignar el pedido guardado al pedido DTO
    this.pedidoDto = data;
    this.pedidoGuardado = this.pedidoDto.nId;

    // Actualizar el carrito de compra con el ID del pedido y el estatus
    const updateObservables = this.listaTwCarritoCompraPedido.map(item => {
      item.nIdPedido = this.pedidoDto.nId;
      item.nEstatus = 2;
      item.sClavePedido= this.pedidoDto.sCvePedido;
      item.nMotivoPedido=1;
      return this.pedidosService.guardaPedidoProducto(item);
    });

    // Ejecutar todas las actualizaciones del carrito
    forkJoin(updateObservables).subscribe(() => {
      // Limpiar el carrito y consultar el carro nuevamente
      this.listaTwCarritoCompraPedido = [];
      this.consultarCarro();
      this.showDialog();
      this.generarPedidoPdf(this.pedidoDto.nId);
      this.consultarDetallePedido();
    });
  });
}

  /*Genera una clave de pedido */
  generarClavePedido(): string {
    const fecha = this.obtenerFechaActual();
    const numeroRandom = this.generarNumeroRandom();
    return `${fecha}${numeroRandom}`;
  }

  obtenerFechaActual(): string {
    const fecha = new Date();
    const año = fecha.getFullYear();
    const mes = ('0' + (fecha.getMonth() + 1)).slice(-2);
    const dia = ('0' + fecha.getDate()).slice(-2);
    return `${año}${mes}${dia}`;
  }

  generarNumeroRandom(): string {
    return Math.floor(1000000000 + Math.random() * 9000000000).toString();
  }

  /* abre el fomulario de registro de producto */
  openNew() {
    this.producto = null;
    this.productDialog = true;
    this.titulo = "Registro de Productos"
  }

  editarProducto(){

   this.productosService.obtenerProductoBeanId(this.vwMetaProductoCompra.nId).subscribe(data=>{
    this.producto=data;
    this.productDialog = true;
    this.titulo = "Actualización Producto";
   });

  }

   /* cierra el fomulario de registro de producto */
  hideDialog() {
    this.productDialog = false;
  }

  /*guarda o actualiuza el producto */
  saveProduct(producto: TcProducto) {
    if (producto.nId) {
      this.productosService.guardaProducto(producto).subscribe(productoActualizado => {
        this.vwMetaProductoCompra.sMarca=productoActualizado.sMarca;
        this.vwMetaProductoCompra.nPrecio=productoActualizado.nPrecio;
        this.vwMetaProductoCompra.sMoneda=productoActualizado.sMoneda;
        this.vwMetaProductoCompra.nIdDescuento=productoActualizado.nIdDescuento;
        this.vwMetaProductoCompra.nTotalUnitarioCalculado=productoActualizado.nPrecioConIva;
        this.vwMetaProductoCompra.nGanancia=productoActualizado.nIdGanancia;
        this.vwMetaProductoCompra.sDescripcion=productoActualizado.sDescripcion;

        this.messageService.add({ severity: 'success', summary: 'Producto Actualizado', detail: 'Producto actualizado correctamente', life: 3000 });
      });
    }
    else {
      this.productosService.guardaProducto(producto).subscribe(productoNuevo => {
        this.messageService.add({ severity: 'success', summary: 'Registro Correcto', detail: 'Producto registrado correctamente', life: 3000 });
      });
    }
  }
  /*cierra el formulario */
  cerrarFormulario(event: boolean) {
    this.dialogo = false;

    this.totalVentas=null;
    this.totalCotizaciones=null;
    this.efectividad=null;





  }

  /*trabajo con fechas para la carga de la venta de productos */
  recibirFechas(fechas: { fechaInicio: string; fechaTermino: string }): void {
    this.datosRecibidos = fechas;
    let fechaInicio: string;
    let fechaTermino: string;
    if (this.datosRecibidos == null || this.datosRecibidos == undefined) {
      const today = new Date();
      fechaInicio = today.toISOString().split('T')[0];
      fechaTermino = today.toISOString().split('T')[0];
    } else {
      fechaInicio = this.datosRecibidos.fechaInicio;
      fechaTermino = this.datosRecibidos.fechaTermino;
    }

    this.getProductosUltimaFechaCompra(fechaInicio, fechaTermino).subscribe(
      data => {
        this.listaProductosUltimaCompra = data;
        this.listaProductosUltimaCompra = this.marcarProductosAgrgadosCarrito(this.listaProductosUltimaCompra, this.listaTwCarritoCompraPedido);
      },
      error => {
         console.error('Error al obtener productos:', error);
      }
    );
  }

  getProductosUltimaFechaCompra(fechaInico: string, fechatermino: string): Observable<any[]> {
    return this.comprasService.obtenerProductosUltimaCompra(fechaInico, fechatermino);
  }

  /*Calcula la efectividad del producto */
  calcularEfectividad(totalVentas: number, totalCotizaciones: number): number {
    if (totalCotizaciones === 0) {
      return 0; // Evitar división por cero
    }
    const efectividad = (totalVentas / totalCotizaciones) * 100;
    return parseFloat(efectividad.toFixed(2));
  }

  /* CONSULTA LOS DATOS PARA LLENAR EL FORMULARIO DE REGISTRO DE PEDIDO DEL PRODUCTO */
  consulaDatosProdcuto() {
    this.comprasService.obtenerVenCotProdAnoDto(this.vwMetaProductoCompra.nId).subscribe(data => {
      this.listaAnoVentaCot = data;
      this.ano = [];
      this.cotizaciones = [];
      this.ventas = [];
      this.efectividad=null;
      this.totalVentas=null;
      this.totalCotizaciones=null
      for (let index = 0; index < data.length; index++) {
        this.ano.push(data[index].ano);
        this.cotizaciones.push(data[index].totalCotizaciones);
        this.ventas.push(data[index].totalVentas);
        this.totalVentas += data[index].totalVentas;
        this.totalCotizaciones += data[index].totalCotizaciones;
      }
      this.efectividad = this.calcularEfectividad(this.totalVentas, this.totalCotizaciones);
      this.lineChartData2 = {
        labels: this.ano,
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
      this.lineChartOptions = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Ventas y cotizaciones por año'
          }
        }, scales: {
          y: {
            ticks: {
              stepSize: 1, // Esto asegura que los pasos sean de 1 en 1
              callback: function (value) {
                return Number.isInteger(value) ? value : null; // Solo muestra números enteros
              }
            }
          }
        }
      };
    })
  }

  


/*Agrega los productos al carrito */
  agregarProducto(producto: VwMetaProductoCompra) {
     //console.log(producto);
    // Realiza la búsqueda del producto en la lista
    const existingProduct = this.listaTwCarritoCompraPedido.find(product => product.nIdProducto===producto.nId );
    // Evalúa si el producto existe en la lista
    if (existingProduct) {
      this.confirmationService.confirm({
        message: 'El producto ya existe en el carrito. ¿Deseas actualizar la cantidad?',
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Aceptar',
        rejectLabel: 'Cancelar',
        accept: () => {
          this.dialogo = true;
          this.vwMetaProductoCompra = producto;
          if(this.vwMetaProductoCompra){
          this.consulaDatosProdcuto();
          }
        },
        reject: () => {
          this.dialogo = false;
        }
      });
    } else {
      this.dialogo = true;
      this.vwMetaProductoCompra = producto;
      if(this.vwMetaProductoCompra){
        this.consulaDatosProdcuto();
        }
    }
  }

  /*selecciona el producto que sale en la busqueda */
  onProductoSeleccionado(producto: TcProducto) {
    console.log(producto);
    this.listaProductosUltimaCompra = [];
    this.comprasService.obtenerProductosVentaCotizacionIdProducto(producto.nId).subscribe(data => {
      this.listaProductosUltimaCompra = data;
      this.listaProductosUltimaCompra = this.marcarProductosAgrgadosCarrito(this.listaProductosUltimaCompra, this.listaTwCarritoCompraPedido);
    });
  }

  search(event: any) {
    const query = event.query;
    this.proveedorService.getResults(query).subscribe(data => {
      this.filteredProveedores = data;
    });
  }

  onSelect(event: any) {
    this.proveedorSeleccionado = event;
  }

  onSubmit() {
    if (this.form.valid) {
      const formData = this.form.value;
      /*  SE LLENA EL OBJETO PARA EL GUARDADO DEL  */
      this.twPedidoProducto.nIdUsuario = this.tokenService.getIdUser();
      this.twPedidoProducto.nIdProducto = this.vwMetaProductoCompra.nId;
      this.twPedidoProducto.nCantidadPedida = this.form.get('cantidad').value;
      this.twPedidoProducto.nIdProveedor = this.proveedorSeleccionado.nId;
      this.twPedidoProducto.dFechaPedido = new Date();
      this.twPedidoProducto.nEstatus = 1;
      this.existingProduct = this.listaTwCarritoCompraPedido.find(product => product.nIdProducto === this.vwMetaProductoCompra.nId && product.nIdProveedor===this.proveedorSeleccionado.nId );
      if (this.existingProduct) {
        this.existingProduct.nCantidadPedida += this.twPedidoProducto.nCantidadPedida;
        this.twPedidoProducto = this.existingProduct;
       // console.log('ya existe el producrto, lo voy a actualizar');
      }
      this.pedidosService.guardaPedidoProducto(this.twPedidoProducto).subscribe(data => {
      
        //console.log('Se guardo el producto', this.twPedidoProducto);

        if(data){
          this.messageService.add({ severity: 'success', summary: 'Mensaje', detail: 'Guardado con éxito', life: 6000 });
        }
        this.consultaCarritoCompraPedido(this.tokenService.getIdUser()).subscribe(
          data => {
            this.listaTwCarritoCompraPedido = data;
            this.listaProductosUltimaCompra = this.marcarProductosAgrgadosCarrito(this.listaProductosUltimaCompra, this.listaTwCarritoCompraPedido);
          },
          error => {
            console.error('Error al obtener productos:', error);
          }
        );
        /*limpia el formulario y deja listo para el siguinete producto */
        this.form.reset();
        this.dialogo = false;
        this.proveedorSeleccionado = null;
        this.totalVentas=0;
        this.totalCotizaciones=0;
        this.efectividad=0;
        this.existingProduct=new TwPedidoProducto();
        this.twPedidoProducto=new TwPedidoProducto();
        
      });
    }
  }


  consultaCarritoCompraPedido(idUsuario: number) {    
    return  this.pedidosService.obtenerProductosCarritoUsuario(idUsuario);
  }

  /*consulta de carrito */
  consultarCarro() {
    this.consultaCarritoCompraPedido(this.tokenService.getIdUser()).subscribe(
      data => {
        this.listaTwCarritoCompraPedido = data;
        if (this.listaTwCarritoCompraPedido.length > 0) {
          this.listaProductosUltimaCompra = this.marcarProductosAgrgadosCarrito(this.listaProductosUltimaCompra, this.listaTwCarritoCompraPedido)
        };
      },
      error => {
        // console.error('Error al obtener productos:', error);
      }
    );
  }
  
  /*mensaje de pedido con cerrado automatico */
  showDialog() {
    this.displayDialog = true;
    setTimeout(() => {
      this.displayDialog = false;
      this.pedidoGuardado=null;
    
    }, 20000); // Cierra el diálogo después de 3 segundos
  }

/*Genera el pdf del pdido registrado */
 
generarPedidoPdf(nId:number){
    //console.log("Se va a generar el comprobante");  
    this.pedidosService.generarPedidoPdf(nId).subscribe(resp => {
  
      
        const file = new Blob([resp], { type: 'application/pdf' });
       // console.log('file: ' + file.size);
        if (file != null && file.size > 0) {
          const fileURL = window.URL.createObjectURL(file);
          const anchor = document.createElement('a');
          anchor.download = 'pedido_' +nId + '.pdf';
          anchor.href = fileURL;
          anchor.click();
          this.messageService.add({severity: 'success', summary: 'Correcto', detail: 'Comprobante de Pedido Generado', life: 6000});
          //una vez generado el reporte limpia el formulario para una nueva venta o cotización 
         
        } else {
          this.messageService.add({severity: 'error', summary: 'Error', detail: 'No se puedo generar el comprobante del pedido', life: 6000});
        }
  
    });
  
  }



  obtenerTodosPedidos() {    
    return   this.pedidosService.obtenerPedidosDetalle();
  }

  

   consultaProductosRegistrados(nId:number){
   

    this.pedidosService.obtenerProductosPedido(nId).subscribe(data=>{
   this.listaPedidos=data;
   //console.log(this.listaPedidos);
   this.detalleDialog=true;


    })


  }

  hideDialogDetalle() {
    this.detalleDialog = false;
  }


  consultarDetallePedido() {
    this.pedidosService.obtenerPedidosDetalle().subscribe(
      data => {
        this.listaPedidoDetalle = data;        
      },
      error => {
         console.error('Error al obtener productos:', error);
      }
    );
  }

muestraVentasProducto(){
   
  let ventasProducto=this.ventasService.obtenerProductoVenta(this.vwMetaProductoCompra.nId);
  this.banMustraVentasProducto=true;

  forkJoin([
          ventasProducto 
        ]).subscribe(resultado => {         
          this.listaVentasProducto=resultado[0];     
  
        })  

}

generarVentaPdf(idVenta:number){

  this.ventasService.generarVentaPdf(idVenta).subscribe(resp => {

    
      const file = new Blob([resp], { type: 'application/pdf' });
      //console.log('file: ' + file.size);
      if (file != null && file.size > 0) {
        const fileURL = window.URL.createObjectURL(file);
        const anchor = document.createElement('a');
        anchor.download = 'venta_' + idVenta + '.pdf';
        anchor.href = fileURL;
        anchor.click();
        this.messageService.add({severity: 'success', summary: 'Se realizó con éxito', detail: 'comprobante de venta Generado', life: 3000});
        //una vez generado el reporte limpia el formulario para una nueva venta o cotización 
       
      } else {
        this.messageService.add({severity: 'error', summary: 'Error', detail: 'Error al generar el comprobante de venta', life: 3000});
      }

  });

}






}
