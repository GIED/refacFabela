import { TcProducto } from './../../../productos/model/TcProducto';

import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService, PrimeNGConfig, SelectItem } from 'primeng/api';
import { Product } from 'src/app/demo/domain/product';
import { ProductService } from 'src/app/demo/service/productservice';
import { CountryService } from '../../../demo/service/countryservice';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Clientes } from 'src/app/administracion/interfaces/clientes';
import { ClienteService } from '../../../administracion/service/cliente.service';
import { ProductoService } from '../../../shared/service/producto.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { SaldoGeneralCliente } from '../../model/TvSaldoGeneralCliente';
import { ThirdPartyDraggable } from '@fullcalendar/interaction';
import { TvStockProducto } from '../../../productos/model/TvStockProducto';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CotizacionDto } from '../../model/dto/CotizacionDto';
import { VentasCotizacionesService } from '../../../shared/service/ventas-cotizaciones.service';
import { DatosVenta } from '../../interfaces/DatosVenta';
import { VentasService } from '../../../shared/service/ventas.service';
import { TwCotizacion } from '../../../productos/model/TcCotizacion';
import { producto } from '../../../productos/interfaces/producto.interfaces';
import { TwProductoBodega } from 'src/app/productos/model/TwProductoBodega';
import { BodegasService } from 'src/app/shared/service/bodegas.service';
import { TokenService } from 'src/app/shared/service/token.service';


@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.scss']
})
export class VentasComponent implements OnInit {

  formGrp: FormGroup;

  clienteSeleccionado:Clientes;
  cliente:string;
  productoSeleccionado:TcProducto;
  producto:string;
  debuncerCliente: Subject<string> = new Subject();
  debuncerProducto: Subject<string> = new Subject();

  listaCliente: Clientes[]=[];
  listaProductoSugerencia: TcProducto[]=[];
  listaProductos: TvStockProducto[];
  productosFiltrados: TvStockProducto[]=[];
  listaCotización: CotizacionDto[]=[];
  estatusList: any[];
  listaProductoBodega: TwProductoBodega[];

  datosRegistraVenta:DatosVenta;
  cotizacionData: TwCotizacion;
  

  mostrarSugerenciasCliente:boolean=false;
  mostrarDetalleCliente:boolean=false;
  mostrarSugerenciasProducto:boolean=false;
  mostrarOpcionesVenta:boolean=false;
  muestraProductos:boolean=false;
  mostrarAlternativos:boolean=false;
  muestraProductosBodega:boolean=false;

  saldoGeneralCliente:SaldoGeneralCliente;
  
  total: number = 0;
  nIdProducto:number;
  stockTotal: number = 0;

  constructor(
    private clienteService:ClienteService,
    private productoService:ProductoService, 
    private messageService: MessageService,
    private ventasCotizacionService: VentasCotizacionesService,
    private ventaService:VentasService,
    private bodegasService: BodegasService,
    private tokenService: TokenService
    ) { 
      this.saldoGeneralCliente = new SaldoGeneralCliente();
      this.listaProductos=[];
      this.cotizacionData= new TwCotizacion();
    }

  ngOnInit(): void {
    this.buscaCliente();
    this.buscaProducto();
    this._initFormGroup();
    
  }

  _initFormGroup(): void{ 
    this.formGrp=new FormGroup({
      clienteCtrl: new FormControl('',[Validators.required,Validators.minLength(3)]),
      productoCtrl: new FormControl('',[Validators.minLength(3)]),
      clienteSeleccionadoCtrl: new FormControl('', []),
      productoSelecionadoCtrl: new FormControl('', []),
      nCantidadCtrl: new FormControl( 0 , [ ])
    });
    
  }

  get clienteCtrl(){
    return this.formGrp.get('clienteCtrl') as FormControl;
  }

  get productoCtrl(){
    return this.formGrp.get('productoCtrl') as FormControl;
  }

  get clienteSeleccionadoCtrl(){
    return this.formGrp.get('clienteSeleccionadoCtrl') as FormControl;
  }
  get productoSelecionadoCtrl(){
    return this.formGrp.get('productoSelecionadoCtrl') as FormControl;
  }
  get nCantidadCtrl(){
    return this.formGrp.get('nCantidadCtrl') as FormControl;
  }

  

  inputCliente(){ 
    this.mostrarDetalleCliente=false;

    if (this.clienteCtrl.valid) {
  
      this.debuncerCliente.next(this.clienteCtrl.value);
    }else{
      this.mostrarSugerenciasCliente=false;
    }  
  }

  buscaCliente(){
    this.debuncerCliente
      .pipe(debounceTime(500))
      .subscribe(valor => { 
        this.clienteService.obtenerClientesLike(valor).subscribe(cliente => {
          //console.log(cliente.length);
          if (cliente.length != 0) {
            this.listaCliente=cliente;
            this.mostrarSugerenciasCliente=true;
            this.messageService.add({severity: 'info', summary: 'coincidencias', detail: 'clientes encontrados', life: 3000});
          }else{
            this.mostrarSugerenciasCliente=false;
            this.messageService.add({severity: 'warn', summary: 'no encontrado', detail: 'cliente no encontrado, Verifique la información.', life: 3000});
          }      
        })
      });
}

valorSeleccionadoCliente(){
  console.log(this.clienteSeleccionadoCtrl.value);
  this.clienteSeleccionado=this.clienteSeleccionadoCtrl.value;
  this.clienteCtrl.setValue(this.clienteSeleccionado.sRazonSocial);
  this.clienteService.obtenerSaldoGeneralCliente(this.clienteSeleccionado.nId).subscribe(saldoCliente=>{
    
    this.mostrarSugerenciasCliente=false;

    if (saldoCliente != null) {
      this.saldoGeneralCliente=saldoCliente;
    }else{
      this.saldoGeneralCliente.nIdCliente=this.clienteSeleccionado.nId;
      this.saldoGeneralCliente.nCreditoDisponible=0;
      this.saldoGeneralCliente.nLimiteCredito=this.clienteSeleccionado.n_limiteCredito;
      this.saldoGeneralCliente.nSaldoTotal=0;
      this.saldoGeneralCliente.tcCliente=this.clienteSeleccionado;
    }
    this.mostrarDetalleCliente=true;
    this.muestraProductos=true;
  });
  
}

inputProducto(){
  this.productosFiltrados=[];
    if (this.productoCtrl.valid && this.productoCtrl.value != '') {
      this.debuncerProducto.next(this.productoCtrl.value);
    }else{
      this.mostrarSugerenciasProducto=false;
    }  
}

buscaProducto(){
  
    this.debuncerProducto
      .pipe(debounceTime(500))
      .subscribe(valor => { 
        this.productoService.obtenerProductosLike(valor).subscribe(productos => {
         // console.log(productos.length);
          if (productos.length != 0) {
            this.listaProductoSugerencia=productos;
            this.mostrarSugerenciasProducto=true;
            this.messageService.add({severity: 'info', summary: 'coincidencias', detail: 'productos encontrados', life: 3000});
          }else{
            this.mostrarSugerenciasProducto=false;
            this.messageService.add({severity: 'warn', summary: 'no encontrado', detail: 'producto no encontrado, Verifique la información.', life: 3000});
          }        
        });
      });
}

valorSeleccionadoProducto(){
  this.productoSeleccionado=this.productoSelecionadoCtrl.value;
  this.productoService.obtenerTotalBodegasIdProducto(this.productoSeleccionado.nId).subscribe(productoStock =>{
    console.log(productoStock);
    if (productoStock.nCantidadTotal === 0) {
      this.messageService.add({severity: 'warn', summary: 'sin existencias', detail: 'El producto seleccionado no cuenta con existencias.', life: 3000});
    }
    this.productosFiltrados.push(productoStock);
    this.mostrarSugerenciasProducto=false;
    this.productoCtrl.setValue('');
  });
}

ubicacionProducto(producto: TvStockProducto){
  this.bodegasService.obtenerProductoBodegas(producto.nIdProducto).subscribe(productoBodega => {
    this.listaProductoBodega = productoBodega;
    for (const key in productoBodega) {
        this.stockTotal += this.listaProductoBodega[key].nCantidad;
    }
});
this.muestraProductosBodega=true;
}

muestraAlternativo(producto: TvStockProducto){
  console.log(producto);
  this.nIdProducto= producto.nIdProducto;
  this.mostrarAlternativos=true;
}

hideDialogAlter(){
  this.mostrarAlternativos=false;
}
hideDialogBodega(){
  this.muestraProductosBodega=false;
}



agregarProduct(producto: TvStockProducto) {
  console.log(producto);
  if (producto.nCantidad == 0 || producto.nCantidad == null) {
    console.log("cantidad recibida: ",this.nCantidadCtrl.value)
    producto.nCantidad=this.nCantidadCtrl.value;
  }
  
  
  //verifica que se agrege una cantidad
  if (producto.nCantidad === 0) {
    //console.log("entro a if");
    
    this.messageService.add({severity: 'warn', summary: 'Atención', detail: 'Debe agregar una cantidad', life: 3000});

  }else{ 

   // if (this.products[this.findIndexById(producto.id, this.products)].quantity < producto.cantidad) {

      //this.messageService.add({severity: 'error', summary: 'Atención', detail: 'Stock insuficiente para realizar la venta', life: 3000});
      //producto.cantidad=0;
      //this.products[this.findIndexById(producto.id, this.products)]=producto;
    //}else{ 

  // si la lista ya tiene datos entra a if para validar que el producto no se repita 
  if (this.listaProductos.length> 0) {
    // si el indice retornado es -1 el producto no existe en la lista y se agrega
    if (this.findIndexById(producto.nIdProducto, this.listaProductos) === -1 ) {

      this.listaProductos.push(producto);

      
    }
    //si entra a else el producto ya existe en la lista y solo actualiza la cantidad
    else{
      
      producto.nCantidad=this.listaProductos[this.findIndexById(producto.nIdProducto, this.listaProductos)].nCantidad +producto.nCantidad;
      this.listaProductos[this.findIndexById(producto.nIdProducto, this.listaProductos)]=producto;
    }
  }
  //si entra a else el producto no existe en la lista
  else{
    console.log("producto con cantidad agregada en else: ",producto);
    this.listaProductos.push(producto);
    
  }
  //obtiene el total de cuenta, resta cantidad del stock general y regresa input a 0
  console.log("total a: "+this.total);
  this.total += producto.tcProducto.nPrecioConIva*this.nCantidadCtrl.value;
  producto.nCantidadTotal=producto.nCantidadTotal-this.nCantidadCtrl.value;
  console.log("total d: "+this.total);
  
  //this.listaProductos[this.findIndexById(producto.nIdProducto, this.listaProductos)]=producto;
  this.productosFiltrados=[];
  this.nCantidadCtrl.setValue(0);
  this.messageService.add({severity: 'success', summary: 'Correcto', detail: 'Producto Agregado Correctamente', life: 3000});
  this.muestraProductosBodega=false;

//}
}

}

quitarProducto(producto: TvStockProducto){
  console.log(producto);
  
  this.total = this.total - producto.tcProducto.nPrecioConIva*producto.nCantidad;
  console.log("total: ",this.total);
  //this.listaProductos[this.findIndexById(producto.nIdProducto, this.listaProductos)]=producto;
  this.listaProductos.splice(this.findIndexById(producto.nIdProducto, this.listaProductos),1);
}

guardarCotizacion(){

  //console.log(this.clienteSeleccionado);
  //console.log(this.listaProductos);

  const productoCotizado: CotizacionDto[]=[];

  let folio = this.createFolio();

  for (let producto of this.listaProductos) {
    const cotizacionDto= new CotizacionDto();
    cotizacionDto.nIdCliente=this.clienteSeleccionado.nId;
    cotizacionDto.nIdUsuario=this.tokenService.getIdUser();
    cotizacionDto.sFolio=folio;
    cotizacionDto.nIdProducto=producto.nIdProducto;
    cotizacionDto.nCantidad=producto.nCantidad;
    cotizacionDto.nPrecioUnitario=producto.tcProducto.nPrecioSinIva;
    cotizacionDto.nIvaUnitario=producto.tcProducto.nPrecioConIva-producto.tcProducto.nPrecioSinIva;
    cotizacionDto.nTotalUnitario=producto.tcProducto.nPrecioConIva;

    productoCotizado.push(JSON.parse(JSON.stringify(cotizacionDto)));
    
  }

  this.listaCotización = productoCotizado;
  console.log("lista enviada");
   console.log(this.listaCotización);

  this.ventasCotizacionService.guardaCotizacion(this.listaCotización).subscribe(cotizacionRegistrada =>{

    if (cotizacionRegistrada.nId !== null) {
      console.log(this.listaProductos);
      console.log(this.saldoGeneralCliente);
      this.cotizacionData = cotizacionRegistrada;
      this.mostrarOpcionesVenta=true;
    }
   
  });
}

generarCotizacionPdf(idCotizacion:number){

  this.ventasCotizacionService.generarCotizacionPdf(idCotizacion).subscribe(resp => {

    
      const file = new Blob([resp], { type: 'application/pdf' });
      console.log('file: ' + file.size);
      if (file != null && file.size > 0) {
        const fileURL = window.URL.createObjectURL(file);
        const anchor = document.createElement('a');
        anchor.download = 'cotizacion_' + idCotizacion + '.pdf';
        anchor.href = fileURL;
        anchor.click();
        this.messageService.add({severity: 'success', summary: 'Correcto', detail: 'Cotizacion Generada', life: 3000});
        
      } else {
        this.messageService.add({severity: 'error', summary: 'Error', detail: 'Error al generar la Cotizacion', life: 3000});
      }

  });

}


soloCotizacion(){

  this.generarCotizacionPdf(this.cotizacionData.nId);

  this.clienteCtrl.setValue('');
  this.productoCtrl.setValue('');
  this.clienteSeleccionadoCtrl.setValue('');
  this.productoSelecionadoCtrl.setValue('');
  this.nCantidadCtrl.setValue('');
  this.listaProductos=[];
  this.total=0.00;
  this.mostrarDetalleCliente=false;
  this.mostrarOpcionesVenta=false;
  this.muestraProductos = false;


}

limpiaFormulario(){


  this.clienteCtrl.setValue('');
  this.productoCtrl.setValue('');
  this.clienteSeleccionadoCtrl.setValue('');
  this.productoSelecionadoCtrl.setValue('');
  this.nCantidadCtrl.setValue('');
  this.listaProductos=[];
  this.total=0.00;
  this.mostrarDetalleCliente=false;
  this.mostrarOpcionesVenta=false;
  this.muestraProductos = false;


}

generarVenta(datosVenta: DatosVenta){

  console.log("Datos para venta en padre");
  console.log(datosVenta);

  this.datosRegistraVenta=datosVenta;
  this.datosRegistraVenta.idCliente=this.clienteSeleccionado.nId;
  this.datosRegistraVenta.idUsuario=this.tokenService.getIdUser();
  this.datosRegistraVenta.sFolioVenta=this.createFolio();
  this.datosRegistraVenta.idTipoVenta=1;
  if (this.datosRegistraVenta.tipoPago === 1) {
    this.datosRegistraVenta.fechaIniCredito=new Date();
    var fin = new Date();
    fin.setDate(fin.getDate() + 30);
    this.datosRegistraVenta.fechaFinCredito=fin;
  }else{
    this.datosRegistraVenta.fechaIniCredito=null;
    this.datosRegistraVenta.fechaFinCredito=null;
  }
  this.datosRegistraVenta.twCotizacion = this.cotizacionData;
  console.log("Datos para guardar");
  console.log(this.datosRegistraVenta);
  console.log(this.cotizacionData);

 this.ventaService.guardaVenta(this.datosRegistraVenta).subscribe(venta =>{
  this.generarVentaPdf(venta.nId);    
  });
  
  


}

generarVentaPdf(idVenta:number){

  this.ventaService.generarVentaPdf(idVenta).subscribe(resp => {

    
      const file = new Blob([resp], { type: 'application/pdf' });
      console.log('file: ' + file.size);
      if (file != null && file.size > 0) {
        const fileURL = window.URL.createObjectURL(file);
        const anchor = document.createElement('a');
        anchor.download = 'venta_' + idVenta + '.pdf';
        anchor.href = fileURL;
        anchor.click();
        this.messageService.add({severity: 'success', summary: 'Correcto', detail: 'comprobante de venta Generado', life: 3000});
        //una vez generado el reporte limpia el formulario para una nueva venta o cotización 
        this.limpiaFormulario();
      } else {
        this.messageService.add({severity: 'error', summary: 'Error', detail: 'Error al generar el comprobante de venta', life: 3000});
      }

  });

}



findIndexById(id: number, arreglo:TvStockProducto[]): number {
  let index = -1;
  for (let i = 0; i < arreglo.length; i++) {
      if (arreglo[i].nIdProducto === id) {
          index = i;
          break;
      }
  }
  return index;
}

createFolio(): string {
  let folio = '';
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for ( let i = 0; i < 5; i++ ) {
    folio += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return folio;
} 

}
