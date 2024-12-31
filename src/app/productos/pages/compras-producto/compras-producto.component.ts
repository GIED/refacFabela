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

@Component({
  selector: 'app-compras-producto',
  templateUrl: './compras-producto.component.html',
  styleUrls: ['./compras-producto.component.scss']
})


export class ComprasProductoComponent implements OnInit {
  
  datosRecibidos: { fechaInicio: string; fechaTermino: string } | null = null;
  listaProductosUltimaCompra:VwMetaProductoCompra[];
  vwMetaProductoCompra:VwMetaProductoCompra;
  dialogo:boolean;
  listaAnoVentaCot:VenCotProdAnoDto[];
  lineChartData2: any
  lineChartOptions: any;
  ano: string[];
  ventas: number[];
  cotizaciones: number[];
  form: FormGroup;
  filteredProveedores: Proveedores[];
  proveedorSeleccionado:Proveedores;
  totalVentas:number;
  totalCotizaciones:number;
  efectividad:number;
  producto:TcProducto;
  products: any = [
    { id: 1, name: 'Producto 1', price: 100, quantity: 1 },
    { id: 2, name: 'Producto 2', price: 200, quantity: 2 },
    // Agrega más productos según sea necesario
  ];
  productDialog:boolean;
  titulo:string;
  listaTwCarritoCompraPedido:TwCarritoCompraPedido[];
  twCarritoCompraPedido: TwCarritoCompraPedido;
  pedidoDto:PedidoDto;
  twPedidoProducto: TwPedidoProducto[];
  twPedidoProductoDto:TwPedidoProducto;
 
  

  constructor(private comprasService:ComprasService,  private messageService: MessageService, private proveedorService:ProveedorService, private fb: FormBuilder, private productosService: ProductoService,
    private tokenService: TokenService,private confirmationService: ConfirmationService, private pedidosService:PedidosService

   ) { 
    this.datosRecibidos=null;
    this.listaProductosUltimaCompra=[];
    this.vwMetaProductoCompra=new VwMetaProductoCompra();
    this.dialogo=false;
    this.listaAnoVentaCot=[];
    this.ano=[];
    this.ventas=[];
    this.cotizaciones=[];
    this.proveedorSeleccionado=null;
    this.totalVentas=0;
    this.totalCotizaciones=0;
    this.efectividad=0;
    this.productDialog=false;
    this.titulo=null;
    this.listaTwCarritoCompraPedido=[];
    this.twCarritoCompraPedido= new TwCarritoCompraPedido();
    this.pedidoDto=new PedidoDto();
    this.twPedidoProducto= [];
    this.twPedidoProductoDto= new TwPedidoProducto();


  }

  ngOnInit(): void {
   
    const today = new Date();
    this.getProductosUltimaFechaCompra(today.toISOString().split('T')[0], today.toISOString().split('T')[0]);
    
    // CREA EL FORMULARIO DE REGISTRO DE PEDIDO PRODUCTO
    this.form = this.fb.group({
      proveedor: [null, Validators.required],
      cantidad: [null, [Validators.required, Validators.pattern('^[0-9]*$')]]   
    });
    console.log(this.tokenService.getIdUser())

    this.consultaCarritoCompraPedido(this.tokenService.getIdUser());

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
    
    /*SE LLENA EL OBJETO PARA GUARADR EL PEDIDO EN PEDIDOS */
   this.pedidoDto.nId=null;
   this.pedidoDto.nIdUsuario=this.tokenService.getIdUser();
   this.pedidoDto.nEstatus=0;
   this.pedidoDto.sCvePedido=this.generarClavePedido();
   this.pedidoDto.dFechaPedido=new Date();

   for (let index = 0; index < this.listaTwCarritoCompraPedido.length; index++) {
    this.twPedidoProductoDto=new TwPedidoProducto();
    this.twPedidoProductoDto.nIdProducto=this.listaTwCarritoCompraPedido[index].nIdProducto;
    this.twPedidoProductoDto.nMotivoPedido=1;
    this.twPedidoProductoDto.nCantidadPedida=this.listaTwCarritoCompraPedido[index].nCantidad;
    this.twPedidoProductoDto.nIdProveedor=this.listaTwCarritoCompraPedido[index].nIdProveedor;
    this.twPedidoProductoDto.nEstatus=true;
    this.twPedidoProductoDto.nIdUsuario=this.tokenService.getIdUser();
    this.twPedidoProductoDto.sClavePedido=this.generarClavePedido();

    this.twPedidoProducto.push(this.twPedidoProductoDto);

 

    
   }
    
   /* SE ASIGNA LA LISTA AL OBETO DE GUARDADO DE PEDIDO DEL OBJETO DTO */
   this.pedidoDto.twPedidoProducto= this.twPedidoProducto;

   /*SE GUARDA EL PEDIDO */
   this.pedidosService.guardaPedido(this.pedidoDto).subscribe(data=>{
   /*SE ASIGA EL PEDIDO GUARDADO AL PEDIDO DTO */
    this.pedidoDto=data;
     
      for (let index = 0; index < this.listaTwCarritoCompraPedido.length; index++) {
        this.listaTwCarritoCompraPedido[index].nIdPedido=this.pedidoDto.nId
        this.listaTwCarritoCompraPedido[index].nEstatus=2
        this.comprasService.guardaProductoCarritoPedido(this.listaTwCarritoCompraPedido[index]).subscribe(data=>{{           
          console.log('se guardo el cambio de estatus de y pedido de:',data);
        }})
        
      }

      this.listaTwCarritoCompraPedido=[];

      this.consultarCarro();
   
   
       console.log('Pedido guardado');
   


    
   })

   
  }


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









  openNew() {
    this.producto = null;
    this.productDialog = true;
    this.titulo = "Registro de Productos"
}

hideDialog(){
  this.productDialog=false;
}
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
  

  cerrarFormulario(event:boolean){

    this.dialogo=false;

  }

  recibirFechas(fechas: { fechaInicio: string; fechaTermino: string }): void {
    this.datosRecibidos = fechas;

    if(this.datosRecibidos==null || this.datosRecibidos==undefined){
      const today = new Date();
     today.toISOString().split('T')[0]; 

     this.getProductosUltimaFechaCompra(today.toISOString().split('T')[0], today.toISOString().split('T')[0]);

    }
    else{     
      this.getProductosUltimaFechaCompra( this.datosRecibidos.fechaInicio, this.datosRecibidos.fechaTermino);
    }
   }

  getProductosUltimaFechaCompra(fechaInico:String, fechatermino:String){
   
    this.comprasService.obtenerProductosUltimaCompra(fechaInico,fechatermino).subscribe(data=>{
      this.listaProductosUltimaCompra=data;
    });
  }

  calcularEfectividad(totalVentas: number, totalCotizaciones: number): number {
    if (totalCotizaciones === 0) {
      return 0; // Evitar división por cero
    }
    const efectividad = (totalVentas / totalCotizaciones) * 100;
    return parseFloat(efectividad.toFixed(2));
  }
  
  agregarProducto(producto:VwMetaProductoCompra){
    this.dialogo=true;
    this.vwMetaProductoCompra=producto;


    this.comprasService.obtenerVenCotProdAnoDto(this.vwMetaProductoCompra.nId).subscribe(data=>{
            this.listaAnoVentaCot=data;
   
      this.ano=[];
      this.cotizaciones=[];
      this.ventas=[];


      for (let index = 0; index < data.length; index++) {
        this.ano.push(data[index].ano);
        this.cotizaciones.push(data[index].totalCotizaciones);
        this.ventas.push(data[index].totalVentas);
        this.totalVentas+=data[index].totalVentas;
        this.totalCotizaciones+=data[index].totalCotizaciones;
    }

    this.efectividad=this.calcularEfectividad( this.totalVentas, this.totalCotizaciones);
    
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
      },  scales: {
        y: {
            ticks: {
                stepSize: 1, // Esto asegura que los pasos sean de 1 en 1
                callback: function(value) {
                    return Number.isInteger(value) ? value : null; // Solo muestra números enteros
                }
            }
        }
    }
  };









      

    })

  } 

  onProductoSeleccionado(producto: TcProducto) {
   
    this.listaProductosUltimaCompra=[];
   
    this.comprasService.obtenerProductosVentaCotizacionIdProducto(producto.nId).subscribe(data=>{        
      this.listaProductosUltimaCompra=data;
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
      this.twCarritoCompraPedido.nIdUsuario=this.tokenService.getIdUser();
      this.twCarritoCompraPedido.nIdProducto=this.vwMetaProductoCompra.nId;
      this.twCarritoCompraPedido.nCantidad=this.form.get('cantidad').value;
      this.twCarritoCompraPedido.nIdProveedor=this.proveedorSeleccionado.nId;
      this.twCarritoCompraPedido.dFechaRegistro=new Date();
      this.twCarritoCompraPedido.nEstatus=1;


      this.comprasService.guardaProductoCarritoPedido(this.twCarritoCompraPedido).subscribe(data=>{
       this.listaTwCarritoCompraPedido=null;
       console.log('Se guardo el producto', this.twCarritoCompraPedido ); 
       this.consultaCarritoCompraPedido(this.tokenService.getIdUser());
       this.form.reset();
       this.dialogo=false;
       this.proveedorSeleccionado=null;       

      });

    }
  }

  consultaCarritoCompraPedido(idUsuario:number){

   this.comprasService.obtenerCarritoCompra(idUsuario).subscribe(data=>{
   console.log(data, 'estos son los datos del carrito');
   this.listaTwCarritoCompraPedido=data;
   });

  }

  consultarCarro(){

    this.consultaCarritoCompraPedido(this.tokenService.getIdUser());

  }

  







}
