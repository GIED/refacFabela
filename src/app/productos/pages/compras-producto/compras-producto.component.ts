import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { locator } from 'src/app/shared/sesion/locator';
import { environment } from 'src/environments/environment';
import { VwMetaProductoCompra } from '../../model/VwMetaProductoCompra';
import { ComprasService } from '../../../shared/service/compras.service';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { VenCotProdAnoDto } from '../../model/VenCotProdAnoDto';
import { ProveedorService } from '../../../administracion/service/proveedor.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Proveedores } from 'src/app/administracion/interfaces/proveedores';
import { TcProducto } from '../../model/TcProducto';
import { ProductoService } from 'src/app/shared/service/producto.service';
import { UsuarioComponent } from '../../../administracion/pages/usuario/usuario.component';
import { TokenService } from 'src/app/shared/service/token.service';
import { TwCarritoCompraPedido } from '../../model/TwCarritoCompraPedido';

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
 
  

  constructor(private comprasService:ComprasService,  private messageService: MessageService, private proveedorService:ProveedorService, private fb: FormBuilder, private productosService: ProductoService,
    private tokenService: TokenService,

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
