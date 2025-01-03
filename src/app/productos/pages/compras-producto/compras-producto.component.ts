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
  listaTwCarritoCompraPedido: TwCarritoCompraPedido[];
  twCarritoCompraPedido: TwCarritoCompraPedido;
  pedidoDto: PedidoDto;
  twPedidoProducto: TwPedidoProducto[];
  twPedidoProductoDto: TwPedidoProducto;
  displayDialog: boolean = false;
  pedidoGuardado:number;
  cols: any[];



  constructor(private comprasService: ComprasService, private messageService: MessageService, private proveedorService: ProveedorService, private fb: FormBuilder, private productosService: ProductoService,
    private tokenService: TokenService, private confirmationService: ConfirmationService, private pedidosService: PedidosService

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
    this.twCarritoCompraPedido = new TwCarritoCompraPedido();
    this.pedidoDto = new PedidoDto();
    this.twPedidoProducto = [];
    this.twPedidoProductoDto = new TwPedidoProducto();


    this.cols = [
      { field: 'twCarritoCompraPedido.sNoParte', header: 'No Parte' },
    

  ]






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
    
    /* SE ESPERA A QUE REGRESEN DE CONSULTAR AMBOS SERVCIOS PARA BUSCAR LOS PRODUCTOS QUE ESTAN AGREGADOS EN LA LISTA */
    forkJoin([consulta1, consulta2]).subscribe((data1) => {       
      /*SE ASIGNAL LOS VALORES DE LOS SERVICIOS A LAS LISTAS*/
      this.listaProductosUltimaCompra = data1[0]
      this.listaTwCarritoCompraPedido = data1[1];
       /*SE PINTAN LOS PRODUCTOS AGREGADOS AL CARRITO DE COMPRAS*/
      this.listaProductosUltimaCompra = this.marcarProductosAgrgadosCarrito(data1[0], data1[1]);
    },
      error => {
        console.error('Error en las consultas:', error);
      }
    );
  }

  marcarProductosAgrgadosCarrito(listaVendidos: VwMetaProductoCompra[], listaCarrito: TwCarritoCompraPedido[]) {
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
    twPedidoProductoDto.nIdProducto = item.nIdProducto;
    twPedidoProductoDto.nMotivoPedido = 1;
    twPedidoProductoDto.nCantidadPedida = item.nCantidad;
    twPedidoProductoDto.nIdProveedor = item.nIdProveedor;
    twPedidoProductoDto.nEstatus = true;
    twPedidoProductoDto.nIdUsuario = this.tokenService.getIdUser();
    twPedidoProductoDto.sClavePedido = this.generarClavePedido();

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
      return this.comprasService.guardaProductoCarritoPedido(item);
    });

    // Ejecutar todas las actualizaciones del carrito
    forkJoin(updateObservables).subscribe(() => {
      // Limpiar el carrito y consultar el carro nuevamente
      this.listaTwCarritoCompraPedido = [];
      this.consultarCarro();
      this.showDialog();
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

   /* cierra el fomulario de registro de producto */
  hideDialog() {
    this.productDialog = false;
  }

  /*guarda o actualiuza el producto */
  saveProduct(producto: TcProducto) {
    if (producto.nId) {
      this.productosService.guardaProducto(producto).subscribe(productoActualizado => {
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
    // console.log(producto.nId);
    // Realiza la búsqueda del producto en la lista
    const existingProduct = this.listaTwCarritoCompraPedido.find(product => product.nIdProducto === producto.nId);
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
          this.consulaDatosProdcuto();
        },
        reject: () => {
          this.dialogo = false;
        }
      });
    } else {
      this.dialogo = true;
      this.vwMetaProductoCompra = producto;
      this.consulaDatosProdcuto();
    }
  }

  /*selecciona el producto que sale en la busqueda */
  onProductoSeleccionado(producto: TcProducto) {
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
      this.twCarritoCompraPedido.nIdUsuario = this.tokenService.getIdUser();
      this.twCarritoCompraPedido.nIdProducto = this.vwMetaProductoCompra.nId;
      this.twCarritoCompraPedido.nCantidad = this.form.get('cantidad').value;
      this.twCarritoCompraPedido.nIdProveedor = this.proveedorSeleccionado.nId;
      this.twCarritoCompraPedido.dFechaRegistro = new Date();
      this.twCarritoCompraPedido.nEstatus = 1;
      const existingProduct = this.listaTwCarritoCompraPedido.find(product => product.nIdProducto === this.vwMetaProductoCompra.nId);
      if (existingProduct) {
        existingProduct.nCantidad += this.twCarritoCompraPedido.nCantidad;
        this.twCarritoCompraPedido = existingProduct;
       // console.log('ya existe el producrto, lo voy a actualizar');
      }
      this.comprasService.guardaProductoCarritoPedido(this.twCarritoCompraPedido).subscribe(data => {
        this.listaTwCarritoCompraPedido = null;
        //console.log('Se guardo el producto', this.twCarritoCompraPedido);
        this.consultaCarritoCompraPedido(this.tokenService.getIdUser()).subscribe(
          data => {
            this.listaTwCarritoCompraPedido = data;
            this.listaProductosUltimaCompra = this.marcarProductosAgrgadosCarrito(this.listaProductosUltimaCompra, this.listaTwCarritoCompraPedido);
          },
          error => {
          //  console.error('Error al obtener productos:', error);
          }
        );
        /*limpia el formulario y deja listo para el siguinete producto */
        this.form.reset();
        this.dialogo = false;
        this.proveedorSeleccionado = null;
        this.totalVentas=0;
        this.totalCotizaciones=0;
        this.efectividad=0;
      });
    }
  }


  consultaCarritoCompraPedido(idUsuario: number) {
    return this.comprasService.obtenerCarritoCompra(idUsuario);
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












}
