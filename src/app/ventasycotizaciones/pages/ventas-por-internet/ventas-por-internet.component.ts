import { Component, OnInit } from '@angular/core';
import { TokenService } from '../../../shared/service/token.service';
import { ClienteService } from '../../../administracion/service/cliente.service';
import { SaldoGeneralCliente } from '../../model/TvSaldoGeneralCliente';
import { TcProducto } from 'src/app/productos/model/TcProducto';
import { Subject } from 'rxjs';
import { TvStockProducto } from 'src/app/productos/model/TvStockProducto';
import { CotizacionDto } from '../../model/dto/CotizacionDto';
import { DatosVenta } from '../../interfaces/DatosVenta';
import { TwCotizacion } from 'src/app/productos/model/TcCotizacion';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { ProductoService } from '../../../shared/service/producto.service';
import { MessageService } from 'primeng/api';
import { VentasCotizacionesService } from 'src/app/shared/service/ventas-cotizaciones.service';
import { TcCliente } from '../../../administracion/model/TcCliente';
import { VentasService } from 'src/app/shared/service/ventas.service';
import { TwPagoComprobanteInternet } from '../../model/TwPagoComprobanteInternet';
import { VentasInternetService } from '../../../shared/service/ventas-internet.service';

@Component({
  selector: 'app-ventas-por-internet',
  templateUrl: './ventas-por-internet.component.html',
  styleUrls: ['./ventas-por-internet.component.scss']
})
export class VentasPorInternetComponent implements OnInit {

  formGrp: FormGroup;


  cliente: TcCliente = new TcCliente();
  productoSeleccionado:TcProducto;
  producto:string;
  debuncerProducto: Subject<string> = new Subject();

  
  listaProductoSugerencia: TcProducto[]=[];
  listaProductos: TvStockProducto[];
  productosFiltrados: TvStockProducto[]=[];
  listaCotización: CotizacionDto[]=[];
  estatusList: any[];

  datosRegistraVenta:DatosVenta;
  cotizacionData: TwCotizacion;
  

  
  
  mostrarSugerenciasProducto:boolean=false;
  mostrarOpcionesVenta:boolean=false;
  muestraProductos:boolean=false;
  mostrarAlternativos:boolean=false;
  muestraProductosBodega:boolean=false;
  mostrarCredito:boolean=false;

  saldoGeneralCliente:SaldoGeneralCliente;

  comprobante:TwPagoComprobanteInternet = new TwPagoComprobanteInternet(); 
  
  total: number = 0;
  nIdProducto:number;
  stockTotal: number = 0;

  constructor(private tokenService: TokenService, 
              private clienteService:ClienteService,
              private productoService:ProductoService, 
              private messageService: MessageService,
              private ventasCotizacionService: VentasCotizacionesService,
              private ventaService:VentasService,
              private ventaInternetService: VentasInternetService) {
    this.saldoGeneralCliente= new SaldoGeneralCliente();
    this.listaProductos=[];
  }

  ngOnInit(): void {

    this.consultarCliente();
    this._initFormGroup();
    this.buscaProducto();
  }

  _initFormGroup(): void{ 
    this.formGrp=new FormGroup({
      productoCtrl: new FormControl('',[Validators.minLength(3)]),
      productoSelecionadoCtrl: new FormControl('', []),
      nCantidadCtrl: new FormControl( 0 , [ ])
    });
    
  }

  get productoCtrl(){
    return this.formGrp.get('productoCtrl') as FormControl;
  }

  get productoSelecionadoCtrl(){
    return this.formGrp.get('productoSelecionadoCtrl') as FormControl;
  }
  get nCantidadCtrl(){
    return this.formGrp.get('nCantidadCtrl') as FormControl;
  }


  consultarCliente(){
    
    this.clienteService.consultaClienteIdUsuario(this.tokenService.getIdUser()).subscribe(resp => {
        this.cliente=resp;  
        ////console.log(this.cliente);   
        this.clienteService.obtenerSaldoGeneralCliente(this.cliente.nId).subscribe(saldoCliente=>{
          if (saldoCliente != null) {
            this.saldoGeneralCliente=saldoCliente;
          }else{
            this.saldoGeneralCliente.nIdCliente=this.cliente.nId;
            this.saldoGeneralCliente.nCreditoDisponible=this.cliente.n_limiteCredito;
            this.saldoGeneralCliente.nLimiteCredito=this.cliente.n_limiteCredito;
            this.saldoGeneralCliente.nSaldoTotal=0;
            this.saldoGeneralCliente.tcCliente=this.cliente;
          }  
          this.mostrarCredito=true;
          this.muestraProductos=true;  
        });    
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
            ////console.log(productos.length);
            if (productos.length != 0) {
              this.listaProductoSugerencia=productos;
              this.mostrarSugerenciasProducto=true;
              this.messageService.add({severity: 'info', summary: 'Se encontraron coincidenias', detail: 'Productos encontrados', life: 3000});
            }else{
              this.mostrarSugerenciasProducto=false;
              this.messageService.add({severity: 'warn', summary: 'No se encontraron coincidencias', detail: 'Producto no encontrado, Verifique la información.', life: 3000});
            }        
          });
        });
  }
  
  valorSeleccionadoProducto(){
    this.productoSeleccionado=this.productoSelecionadoCtrl.value;
    this.productoService.obtenerTotalBodegasIdProducto(this.productoSeleccionado.nId).subscribe(productoStock =>{
      ////console.log(productoStock);
      if (productoStock.nCantidadTotal === 0) {
        this.messageService.add({severity: 'warn', summary: 'Sin existencias', detail: 'El producto seleccionado no cuenta con existencias.', life: 3000});
      }
      this.productosFiltrados.push(productoStock);
      this.mostrarSugerenciasProducto=false;
      this.productoCtrl.setValue('');
    });
  }

  agregarProduct(producto: TvStockProducto) {
    ////console.log(producto);
    if (producto.nCantidad == 0 || producto.nCantidad == null) {
      ////console.log("cantidad recibida: ",this.nCantidadCtrl.value)
      producto.nCantidad=this.nCantidadCtrl.value;
    }
    
    
    //verifica que se agrege una cantidad
    if (producto.nCantidad === 0) {
      //////console.log("entro a if");
      
      this.messageService.add({severity: 'warn', summary: 'Atención', detail: 'Debe agregar una cantidad', life: 3000});
  
    }else{ 
  
      if (producto.nCantidadTotal < producto.nCantidad) {
  
        this.messageService.add({severity: 'error', summary: 'Atención', detail: 'Stock insuficiente para realizar la compra', life: 3000});
        this.nCantidadCtrl.setValue(0);
        //this.products[this.findIndexById(producto.id, this.products)]=producto;
      }else{ 
  
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
      ////console.log("producto con cantidad agregada en else: ",producto);
      this.listaProductos.push(producto);
      
    }
    //obtiene el total de cuenta, resta cantidad del stock general y regresa input a 0
  
    this.total += producto.tcProducto.nPrecioConIva*this.nCantidadCtrl.value;
    producto.nCantidadTotal=producto.nCantidadTotal-this.nCantidadCtrl.value;
   
    
    //this.listaProductos[this.findIndexById(producto.nIdProducto, this.listaProductos)]=producto;
    this.productosFiltrados=[];
    this.nCantidadCtrl.setValue(0);
    this.messageService.add({severity: 'success', summary: 'Se realizó con éxito', detail: 'Producto Agregado Correctamente', life: 3000});
    this.muestraProductosBodega=false;
  
  }
  }
  
  }
  
  quitarProducto(producto: TvStockProducto){
    ////console.log(producto);
    
    this.total = this.total - producto.tcProducto.nPrecioConIva*producto.nCantidad;
    ////console.log("total: ",this.total);
    //this.listaProductos[this.findIndexById(producto.nIdProducto, this.listaProductos)]=producto;
    this.listaProductos.splice(this.findIndexById(producto.nIdProducto, this.listaProductos),1);
  }
  

  guardarCotizacion(){

    //////console.log(this.clienteSeleccionado);
    //////console.log(this.listaProductos);
  
    const productoCotizado: CotizacionDto[]=[];
  
    let folio = this.createFolio();
  
    for (let producto of this.listaProductos) {
      const cotizacionDto= new CotizacionDto();
      cotizacionDto.nIdCliente=this.cliente.nId;
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
    ////console.log("lista enviada");
     ////console.log(this.listaCotización);
    
    //registra cotizacion en twCotizacion
    this.ventasCotizacionService.guardaCotizacion(this.listaCotización).subscribe(cotizacionRegistrada =>{
  
      if (cotizacionRegistrada.nId !== null) {
        ////console.log(this.listaProductos);
        ////console.log(this.saldoGeneralCliente);
        this.cotizacionData = cotizacionRegistrada;

        this.comprobante.nIdCotizacion=this.cotizacionData.nId;
        this.comprobante.nIdCliente=this.cotizacionData.nIdCliente;
        this.comprobante.nStatus=0;
        //regitra datos en tabla twPagoComprobanteInternet
        this.ventaInternetService.guardaRegistroCI(this.comprobante).subscribe(resp =>{
          this.generarCotizacionPdf(resp.twPagoComprobanteInternet.nIdCotizacion);
          this.soloCotizacion();
        });
      }
     
    });
  }

  
generarCotizacionPdf(idCotizacion:number){

 
  this.ventasCotizacionService.generarCotizacionPdf(idCotizacion).subscribe(resp => {

    
      const file = new Blob([resp], { type: 'application/pdf' });
      ////console.log('file: ' + file.size);
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

  

  this.productoCtrl.setValue('');
  this.productoSelecionadoCtrl.setValue('');
  this.nCantidadCtrl.setValue('');
  this.listaProductos=[];
  this.total=0.00;
  this.muestraProductos = false;


}

limpiaFormulario(){

  this.productoCtrl.setValue('');
  this.productoSelecionadoCtrl.setValue('');
  this.nCantidadCtrl.setValue('');
  this.listaProductos=[];
  this.total=0.00;
  this.mostrarOpcionesVenta=false;
  this.muestraProductos = false;


}

generarVenta(datosVenta: DatosVenta){

  ////console.log("Datos para venta en padre");
  ////console.log(datosVenta);

  this.datosRegistraVenta=datosVenta;
  this.datosRegistraVenta.idCliente=this.cliente.nId;
  this.datosRegistraVenta.idUsuario=this.tokenService.getIdUser();
  this.datosRegistraVenta.sFolioVenta=this.createFolio();
  this.datosRegistraVenta.idTipoVenta=2;
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
  ////console.log("Datos para guardar");
  ////console.log(this.datosRegistraVenta);
  ////console.log(this.cotizacionData);

 this.ventaService.guardaVenta(this.datosRegistraVenta).subscribe(venta =>{
  this.generarVentaPdf(venta.nId);    
  });
  
  


}

generarVentaPdf(idVenta:number){

  this.ventaService.generarVentaPdf(idVenta).subscribe(resp => {

    
      const file = new Blob([resp], { type: 'application/pdf' });
      ////console.log('file: ' + file.size);
      if (file != null && file.size > 0) {
        const fileURL = window.URL.createObjectURL(file);
        const anchor = document.createElement('a');
        anchor.download = 'venta_' + idVenta + '.pdf';
        anchor.href = fileURL;
        anchor.click();
        this.messageService.add({severity: 'success', summary: 'Correcto', detail: 'comprobante de compra Generado', life: 3000});
        //una vez generado el reporte limpia el formulario para una nueva venta o cotización 
        this.limpiaFormulario();
      } else {
        this.messageService.add({severity: 'error', summary: 'Error', detail: 'Error al generar el comprobante de compra', life: 3000});
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
