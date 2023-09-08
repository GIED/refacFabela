import { TcProducto } from './../../../productos/model/TcProducto';

import { Component, OnInit } from '@angular/core';
import { ConfirmationService, ConfirmEventType, MessageService, PrimeNGConfig, SelectItem } from 'primeng/api';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Clientes } from 'src/app/administracion/interfaces/clientes';
import { ClienteService } from '../../../administracion/service/cliente.service';
import { ProductoService } from '../../../shared/service/producto.service';
import { SaldoGeneralCliente } from '../../model/TvSaldoGeneralCliente';
import { TvStockProducto } from '../../../productos/model/TvStockProducto';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CotizacionDto } from '../../model/dto/CotizacionDto';
import { VentasCotizacionesService } from '../../../shared/service/ventas-cotizaciones.service';
import { DatosVenta } from '../../interfaces/DatosVenta';
import { VentasService } from '../../../shared/service/ventas.service';
import { TwCotizacion } from '../../../productos/model/TcCotizacion';
import { TwProductoBodega } from 'src/app/productos/model/TwProductoBodega';
import { BodegasService } from 'src/app/shared/service/bodegas.service';
import { TokenService } from 'src/app/shared/service/token.service';
import { TwMaquinaCliente } from '../../../productos/model/TwMaquinaCliente';
import { ProductoDescuentoDto } from '../../../productos/model/ProductoDescuentoDto';



@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.scss']
})
export class VentasComponent implements OnInit {

  formGrp: FormGroup;

  clienteSeleccionado:Clientes;
  maquinaCliente:TwMaquinaCliente;
  cliente:string;
  productoSeleccionado:TcProducto;
  producto:string;
  debuncerCliente: Subject<string> = new Subject();
  debuncerProducto: Subject<string> = new Subject();
  clienteDialog: boolean;

  listaCliente: Clientes[]=[];
  listaProductoSugerencia: TcProducto[]=[];
  listaProductos: TvStockProducto[];
  productosFiltrados: TvStockProducto[]=[];
  productosAlternativos: TvStockProducto[]=[];

  listaCotización: CotizacionDto[]=[];
  estatusList: any[];
  listaProductoBodega: TwProductoBodega[];

  datosRegistraVenta:DatosVenta;
  cotizacionData: TwCotizacion;
  productoNuevoPrecio:TcProducto;
  

  mostrarSugerenciasCliente:boolean=false;
  mostrarDetalleCliente:boolean=false;
  mostrarSugerenciasProducto:boolean=false;
  mostrarOpcionesVenta:boolean=false;
  muestraProductos:boolean=false;
  mostrarAlternativos:boolean=false;
  muestraProductosBodega:boolean=false;
  mostrarMaquinasCliente:boolean=false;
  mostrarFormularioMaquinasCliente:boolean=false;

  saldoGeneralCliente:SaldoGeneralCliente;
  tvStockProducto: TvStockProducto;
  mostrarDistribucionBodega:boolean=false;;
  mostrarProductosCotizacionCliente=false;
  
  total: number = 0;
  nIdProducto:number;
  stockTotal: number = 0;

  incremento:number=0;
  objCliente:Clientes=undefined;
  nIdProductoConsulta:number;
  mostrarHistoriaStockProducto:boolean=false;
  productoDescuentoDto:ProductoDescuentoDto;

  constructor(
    private clienteService:ClienteService,
    private productoService:ProductoService, 
    private messageService: MessageService,
    private ventasCotizacionService: VentasCotizacionesService,
    private ventaService:VentasService,
    private bodegasService: BodegasService,
    private tokenService: TokenService,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder
    ) { 
      this.saldoGeneralCliente = new SaldoGeneralCliente();
      this.listaProductos=[];
      this.cotizacionData= new TwCotizacion();
      this.productosAlternativos=[];
      this.maquinaCliente=new TwMaquinaCliente;
      this.clienteDialog=false;
      this.objCliente=undefined;
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
      nCantidadCtrl: new FormControl( 0 , [ ]),
      nIncrementoCtrl:  new FormControl( '' , [ ])
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
  get nIncrementoCtrl(){
    return this.formGrp.get('nIncrementoCtrl') as FormControl;
  }

  abrirCotizacionProductoCliente(nIdProducto:number){
    this.maquinaCliente.nIdCliente=this.clienteSeleccionado.nId; 
    this.nIdProductoConsulta=nIdProducto;

this.mostrarProductosCotizacionCliente=true;


  }


  

  inputCliente(){ 
    this.mostrarDetalleCliente=false;

    if (this.clienteCtrl.valid) {
  
      this.debuncerCliente.next(this.clienteCtrl.value);
    }else{
      this.mostrarSugerenciasCliente=false;
    }  
  }

  openNew() { 

    this.clienteDialog = true;
    this.objCliente=null; 
   
  }

  mostrarditribucionBodegas(nId:number){
    this.bodegasService.obtenerProductoBodegas(nId).subscribe(data=>{
      this.listaProductoBodega=data;
      this.mostrarDistribucionBodega=true;

    })

  }

  buscaCliente(){
    this.debuncerCliente
      .pipe(debounceTime(500))
      .subscribe(valor => { 
        this.clienteService.obtenerClientesLike(valor).subscribe(cliente => {
          ////console.log(cliente.length);
          if (cliente.length != 0) {
            this.listaCliente=cliente;
            this.mostrarSugerenciasCliente=true;
            this.messageService.add({severity: 'info', summary: 'Se encontraron coincidenicas', detail: 'Clientes encontrados', life: 3000});
          }else{
            this.mostrarSugerenciasCliente=false;
            this.messageService.add({severity: 'warn', summary: 'No se encontraron coincidencias', detail: 'Cliente no encontrado, Verifique la información.', life: 3000});
          }      
        })
      });
}

valorSeleccionadoCliente(){
  //console.log(this.clienteSeleccionadoCtrl.value);
  this.clienteSeleccionado=this.clienteSeleccionadoCtrl.value;
  this.clienteCtrl.setValue(this.clienteSeleccionado.sRazonSocial);
  this.clienteService.obtenerSaldoGeneralCliente(this.clienteSeleccionado.nId).subscribe(saldoCliente=>{
    
    this.mostrarSugerenciasCliente=false;

    if (saldoCliente != null) {
      this.saldoGeneralCliente=saldoCliente;
    }else{
      this.saldoGeneralCliente.nIdCliente=this.clienteSeleccionado.nId;
      this.saldoGeneralCliente.nCreditoDisponible=this.clienteSeleccionado.n_limiteCredito;
      this.saldoGeneralCliente.nLimiteCredito=this.clienteSeleccionado.n_limiteCredito;
      this.saldoGeneralCliente.nSaldoTotal=0;
      this.saldoGeneralCliente.tcCliente=this.clienteSeleccionado;
    }
    this.mostrarDetalleCliente=true;
    this.muestraProductos=true;
  });
  
}

obtenerMaquinasCliente(){

  this.mostrarMaquinasCliente=true;
  

}
cerrarVentanas(valor:boolean){
  
  this.mostrarFormularioMaquinasCliente=valor;
 
}

abrirFormularioMaquinaCliente(){

  this.maquinaCliente.nIdCliente=this.clienteSeleccionado.nId; 
  this.mostrarFormularioMaquinasCliente=true;
  
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
         // //console.log(productos.length);
          if (productos.length != 0) {
            this.listaProductoSugerencia=productos;
            this.mostrarSugerenciasProducto=true;
            this.messageService.add({severity: 'info', summary: 'Se encontraron coincidencias', detail: 'Productos encontrados', life: 3000});
          }else{
            this.mostrarSugerenciasProducto=false;
            this.messageService.add({severity: 'warn', summary: 'No se encontraron coincidencias', detail: 'Producto no encontrado, Verifique la información.', life: 3000});
          }        
        });
      });
}

limpiarlistas(){
  this.productosAlternativos=[];
}

valorSeleccionadoProducto(){
  this.limpiarlistas();
  
  this.productoSeleccionado=this.productoSelecionadoCtrl.value;
  this.ubicacionProducto(this.productoSeleccionado.nId);
  this.nIdProducto=this.productoSeleccionado.nId;  
  this.obtenerProductosAlternativos(this.productoSeleccionado.nId);
  this.productoService.obtenerTotalBodegasIdProducto(this.productoSeleccionado.nId).subscribe(productoStock =>{
    //console.log(productoStock);
    if (productoStock.nCantidadTotal === 0) {
      this.messageService.add({severity: 'warn', summary: 'Sin existencias', detail: 'El producto seleccionado no cuenta con existencias.', life: 3000});
    }else{

    }   
    this.productosFiltrados.push(productoStock);
   
this.calcularPrecio(productoStock);


 
    this.mostrarSugerenciasProducto=false;
    this.productoCtrl.setValue('');
  });
}

sumarIncremento(tvStockProducto :TvStockProducto){

   if(this.nIncrementoCtrl.value>=0){ 

  this.productoService.obtenerTotalBodegasIdProducto(this.productoSeleccionado.nId).subscribe(productoStock =>{
   this.incremento=this.nIncrementoCtrl.value;

  let suma;
  
  suma=productoStock.tcProducto.nPrecio+this.incremento;
  tvStockProducto.tcProducto.nPrecio=suma;
 
 this.calcularPrecio(tvStockProducto);



  });
}

else{

  this.messageService.add({severity: 'warn', summary: 'Atención', detail: 'Debe agregar un aumento igual ó superior 0', life: 3000});

}




}

calcularPrecio(tvStockProducto :TvStockProducto){


this.productoDescuentoDto=new ProductoDescuentoDto;
this.productoDescuentoDto.tcProducto=tvStockProducto.tcProducto;
this.productoDescuentoDto.tcCliente=this.clienteSeleccionado;


 this.productoService.calcularPrecioProducto(this.productoDescuentoDto).subscribe(data=>{
 
   this.productoNuevoPrecio=data;

   console.log(this.productoNuevoPrecio);
   
  for (let index = 0; index < this.productosFiltrados.length; index++) {
    this.productosFiltrados[index].tcProducto.nPrecioPeso=this.productoNuevoPrecio.nPrecioPeso;
     this.productosFiltrados[index].tcProducto.nPrecioConIva=this.productoNuevoPrecio.nPrecioConIva;
     this.productosFiltrados[index].tcProducto.nPrecioSinIva=this.productoNuevoPrecio.nPrecioSinIva;
     this.productosFiltrados[index].tcProducto.sProducto=this.productoNuevoPrecio.sProducto;
    
  }

  
 })

  return this.productoNuevoPrecio;

}

 trunc (x, posiciones = 0) {
  var s = x.toString()
  var l = s.length
  var decimalLength = s.indexOf('.') + 1
  var numStr = s.substr(0, decimalLength + posiciones)
  return Number(numStr)
}

ubicacionProducto(nId: number){
  this.bodegasService.obtenerProductoBodegas(nId).subscribe(productoBodega => {
    this.listaProductoBodega = productoBodega;

    
    // for (const key in productoBodega) {
      //     this.stockTotal += this.listaProductoBodega[key].nCantidad;
      // }

      let bodega1:number=0;
      let cantidad1:number=0;
      let bodega2:number=0;
      let cantidad2:number=0;
      let bodega3:number=0;
      let cantidad3:number=0;
      
      for (const objBodega of productoBodega) {

       

        if (objBodega.nIdBodega==1) {
          bodega1=1;
          cantidad1=objBodega.nCantidad;
        }else if (objBodega.nIdBodega==2) {
          bodega2=2;
          cantidad2=objBodega.nCantidad;
        }else{
          bodega3=3;
          cantidad3=objBodega.nCantidad;
        }
    
      }
      if (cantidad1==0 && (cantidad2>0 || cantidad3>0)) {
        if (cantidad2>0 && bodega2==2 ) {
          this.confirmationService.confirm({
            message: 'Este producto requiere un traslado de la bodega de casa?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.messageService.add({severity:'info', summary:'Aceptado', detail:'Traslado Aceptado'});
            },
            reject: (type) => {
                switch(type) {
                    case ConfirmEventType.REJECT:
                        this.messageService.add({severity:'error', summary:'Cancelado', detail:'Traslado no Aceptado'});
                    break;
                    case ConfirmEventType.CANCEL:
                        this.messageService.add({severity:'warn', summary:'Cancelled', detail:'Cancelar'});
                    break;
                }
            }
        });
        }else{
          this.confirmationService.confirm({
            message: 'Este producto requiere un traslado de la bodega de Tenango?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.messageService.add({severity:'info', summary:'Aceptado', detail:'Traslado Aceptado'});
            },
            reject: (type) => {
                switch(type) {
                    case ConfirmEventType.REJECT:
                        this.messageService.add({severity:'error', summary:'Cancelado', detail:'Traslado no Aceptado'});
                    break;
                    case ConfirmEventType.CANCEL:
                        this.messageService.add({severity:'warn', summary:'Cancelled', detail:'Cancelar'});
                    break;
                }
            }
        });
        }
      }

      
      
    

});
this.muestraProductosBodega=true;
}

muestraAlternativo(producto: TvStockProducto){
  //console.log(producto);
  this.nIdProducto= producto.nIdProducto;
  this.mostrarAlternativos=true;
}

hideDialogAlter(){
  this.mostrarAlternativos=false;
}
hideDialogBodega(){
  this.muestraProductosBodega=false;
}

obtenerProductosAlternativos(nId:number ) {
    
  this.productoService.obtenerProductosAlternativosDescuento(this.nIdProducto, this.clienteSeleccionado.nId)
    .subscribe((productosAlter) => {
       productosAlter;
      //console.log("Alternativos");
      console.log(productosAlter);

       for (let index = 0; index < productosAlter.length; index++) {
          
        this.tvStockProducto = new TvStockProducto();

        this.productoService.obtenerTotalBodegasIdProducto(productosAlter[index].nIdProductoAlternativo).subscribe(productoStock =>{
          if (productoStock != null) {   
           
            this.tvStockProducto=productoStock;
            this.tvStockProducto.tcProducto=productosAlter[index].tcProductoAlternativo;

            this.productosAlternativos.push(this.tvStockProducto);
          }
        });

        
       }



     
      
      
    });
}




agregarProduct(producto: TvStockProducto) {
  //console.log(producto);
  if (producto.nCantidad == 0 || producto.nCantidad == null) {
    //console.log("cantidad recibida: ",this.nCantidadCtrl.value)
    producto.nCantidad=this.nCantidadCtrl.value;
    this.listaProductoBodega=[];
    this.productosFiltrados=[];
    this.nIdProducto=null;
    this.limpiarlistas();
  }
  
  
  //verifica que se agrege una cantidad
  if (producto.nCantidad === 0) {
    ////console.log("entro a if");
    
    this.messageService.add({severity: 'warn', summary: 'Atención', detail: 'Debe agregar una cantidad', life: 3000});

  }else{ 

   // if (this.products[this.findIndexById(producto.id, this.products)].quantity < producto.cantidad) {

      //this.messageService.add({severity: 'error', summary: 'Atención', detail: 'Stock insuficiente para realizar la venta', life: 3000});
      //producto.cantidad=0;
      //this.products[this.findIndexById(producto.id, this.products)]=producto;
    //}else{ 

  // si la lista ya tiene datos entra a if para validar que el producto no se repita 
  if (this.listaProductos.length> 0) {

  
   let index = 0;
   let posicion=0;
   let productoEncontrado:TvStockProducto;
   
    for ( index ; index < this.listaProductos.length; index++) {
         let productoEnLista:TvStockProducto=new TvStockProducto();
            if(this.listaProductos[index].nIdProducto==producto.nIdProducto){
              productoEnLista = this.listaProductos[index];
              posicion=index;
              productoEncontrado=productoEnLista;
              
            }     
        
       }

       if(productoEncontrado!=null || productoEncontrado!=undefined){
        let actualizaProductoEnLista: TvStockProducto = new TvStockProducto();    
        actualizaProductoEnLista.nIdProducto = producto.nIdProducto;
        actualizaProductoEnLista.nCantidadTotal = producto.nCantidadTotal;
        actualizaProductoEnLista.nCantidad = productoEncontrado.nCantidad+producto.nCantidad;
        actualizaProductoEnLista.tcProducto = producto.tcProducto;
        actualizaProductoEnLista.nStatus = producto.nStatus;
        actualizaProductoEnLista.nTipoPago = producto.nTipoPago;
        actualizaProductoEnLista.nIdProveedor = producto.nIdProveedor;
        this.listaProductos[posicion] = actualizaProductoEnLista;


      }
      else{
    this.listaProductos.push(producto);
       }

  

    

  }
  //si entra a else el producto no existe en la lista
  else{
   
    this.listaProductos.push(producto);
    
  }
  //obtiene el total de cuenta, resta cantidad del stock general y regresa input a 0
 
  this.total += producto.tcProducto.nPrecioConIva*this.nCantidadCtrl.value;
  producto.nCantidadTotal=producto.nCantidadTotal-this.nCantidadCtrl.value;
 
  
  //this.listaProductos[this.findIndexById(producto.nIdProducto, this.listaProductos)]=producto;
  this.productosFiltrados=[];
  this.nCantidadCtrl.setValue(0);
  this.messageService.add({severity: 'success', summary: 'Correcto', detail: 'Producto Agregado Correctamente', life: 3000});
  this.muestraProductosBodega=false;

//}
}

}

quitarProducto(producto: TvStockProducto){
 
  
  this.total = this.total - producto.tcProducto.nPrecioConIva*producto.nCantidad;
  //console.log("total: ",this.total);
  //this.listaProductos[this.findIndexById(producto.nIdProducto, this.listaProductos)]=producto;
  this.listaProductos.splice(this.findIndexById(producto.nIdProducto, this.listaProductos),1);
}

guardarCotizacion(){



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
    cotizacionDto.nIvaUnitario=producto.tcProducto.nPrecioIva;
    cotizacionDto.nTotalUnitario=producto.tcProducto.nPrecioConIva;
    cotizacionDto.nInDescuento=producto.tcProducto.nIdDescuento;

    productoCotizado.push(JSON.parse(JSON.stringify(cotizacionDto)));
    
  }

  this.listaCotización = productoCotizado;
 

  this.ventasCotizacionService.guardaCotizacion(this.listaCotización).subscribe(cotizacionRegistrada =>{

    if (cotizacionRegistrada.nId !== null) {
      //console.log(this.listaProductos);
      //console.log(this.saldoGeneralCliente);
      this.cotizacionData = cotizacionRegistrada;
      this.mostrarOpcionesVenta=true;
    }
   
  });
}

generarCotizacionPdf(idCotizacion:number){

 
  this.ventasCotizacionService.generarCotizacionPdf(idCotizacion).subscribe(resp => {

    
      const file = new Blob([resp], { type: 'application/pdf' });
     
      if (file != null && file.size > 0) {
        const fileURL = window.URL.createObjectURL(file);
        const anchor = document.createElement('a');
        anchor.download = 'cotizacion_' + idCotizacion + '.pdf';
        anchor.href = fileURL;
        anchor.click();
        this.messageService.add({severity: 'success', summary: 'Se realizó con éxito', detail: 'Cotizacion Generada', life: 3000});
        
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
hideDialog(event:boolean) {
    
  this.clienteDialog = false;
 
  
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
  this.nIncrementoCtrl.setValue(0);


}

generarVenta(datosVenta: DatosVenta){



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
 

 this.ventaService.guardaVenta(this.datosRegistraVenta).subscribe(venta =>{
  this.generarVentaPdf(venta.nId);    
  });
  
  


}

generarVentaPdf(idVenta:number){

  this.ventaService.generarVentaPdf(idVenta).subscribe(resp => {

    
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
