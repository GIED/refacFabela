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
import Decimal from 'decimal.js';
import { CalculaPrecioDto } from 'src/app/productos/model/CalculaPrecioDto';
import { PartService } from 'src/app/shared/service/part.service';
import { CtpConstantes } from 'src/app/shared/utils/UserPart.enum';
import { PartResponse } from 'src/app/productos/model/PartResponse ';
import { ModeActionOnModel } from 'src/app/shared/utils/model-action-on-model';
import { DialogService } from 'primeng/dynamicdialog';
import { FormProductoComponent } from 'src/app/productos/components/form-producto/form-producto.component';
import { ModelContainer } from 'src/app/shared/utils/model-container';



@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.scss']
})
export class VentasComponent implements OnInit {

  private readonly ivaFactor = new Decimal('1.16');
  private readonly incrementoMinimo = new Decimal('0');
  private preciosBasePorProducto = new Map<number, { precioPeso: Decimal; precioConIva: Decimal; precioSinIva: Decimal; precioIva: Decimal; sProducto: string; nIdDescuento: number; tcDescuento: any; nPrecioOriginal: number }>();
  private incrementosPorProducto = new Map<number, Decimal>();

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
  
  total: Decimal = new Decimal(0);
  nIdProducto:number;
  stockTotal: number = 0;
  banBusquedaCorizaciones:boolean=false;

  incremento:Decimal= new Decimal('0');
  objCliente:Clientes=undefined;
  nIdProductoConsulta:number;
  mostrarHistoriaStockProducto:boolean=false;
  productoDescuentoDto:ProductoDescuentoDto;
  regreso:boolean;
  mostrarCotizacionesVigentes:boolean;
  banAlternativos:boolean=false;
  resultado: PartResponse
    error?: string;
    mostrarPrecioProveedor:boolean=false;
    rutaImagen:string=null;
    rutaImagenDefault: string = 'assets/layout/images/default.png';


  constructor(
    private clienteService:ClienteService,
    private productoService:ProductoService, 
    private messageService: MessageService,
    private ventasCotizacionService: VentasCotizacionesService,
    private ventaService:VentasService,
    private bodegasService: BodegasService,
    private tokenService: TokenService,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder,
    private partService: PartService,
    public dialogService: DialogService,
    ) { 
      this.saldoGeneralCliente = new SaldoGeneralCliente();
      this.listaProductos=[];
      this.cotizacionData= new TwCotizacion();
      this.productosAlternativos=[];
      this.maquinaCliente=new TwMaquinaCliente;
      this.clienteDialog=false;
      this.objCliente=undefined;
      this.regreso=false;
    }

  ngOnInit(): void {
    
    this.buscaCliente();
    this.buscaProducto();
    this._initFormGroup();
    this.banBusquedaCorizaciones=false;
  
    
  }



  consultaInventarioCostex(NoParte:string, nCantidad:string){

      

      this.partService.obtenerProductoCostex(NoParte,nCantidad).subscribe(data=>{
        console.log(data);
      })
     


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

  abrirCotizaciones(){
    if(this.clienteSeleccionado!=null){
    this.mostrarCotizacionesVigentes=true;
    }
    else{

      this.messageService.add({severity: 'warn', summary: 'Error', detail: 'Debe elegir un cliente', life: 3000});


    }
  }

  cargarListaCompra(nIdCotizacion: number): void {
  this.mostrarCotizacionesVigentes = false;

  this.ventasCotizacionService.obtenerCotizacionProducto(nIdCotizacion).subscribe(data => {
  

    for (let index = 0; index < data.length; index++) {
      const item = data[index];

      const productoEnLista = new TvStockProducto();
      productoEnLista.nIdProducto = item.nIdProducto;
      productoEnLista.tcProducto = item.tcProducto;

      // Asegura conversión a Decimal
      productoEnLista.tcProducto.nPrecioSinIva = new Decimal(item.nPrecioUnitario?.toString());
      productoEnLista.tcProducto.nPrecio = new Decimal(item.nPrecioUnitario?.toString());
      productoEnLista.tcProducto.nPrecioIva = new Decimal(item.nIvaPartida?.toString());
      productoEnLista.tcProducto.nPrecioPeso = new Decimal(item.nPrecioUnitario?.toString());
      productoEnLista.tcProducto.nPrecioConIva = new Decimal(item.nTotalUnitario?.toString());

      productoEnLista.nCantidad = item.nCantidad;
      productoEnLista.nTotalUnitario = new Decimal(item.nTotalUnitario?.toString());
      productoEnLista.nTotalPartida = new Decimal(item.nTotalPartida?.toString());

      this.listaProductos.push(productoEnLista);
    }

    this.total = this.calculaTotalCarrito(); // ya retorna un Decimal truncado
  });
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

  formProducto(): void {
      const ref = this.dialogService.open(FormProductoComponent, {
        data: new ModelContainer(ModeActionOnModel.WATCHING, new TcProducto()),
        header: 'Registro de Producto',
        width: '70%',
        height: 'auto',
        baseZIndex: 1000,
        closable: true,
        dismissableMask: true,
        modal: true
      });
  
      ref.onClose.subscribe((productoGuardado: TcProducto | undefined) => {
        if (productoGuardado) {
          // Aquí puedes actualizar tu lista, tabla, etc.
          console.log('Producto recibido desde el diálogo:', productoGuardado);
          // Ejemplo: recargar lista o actualizar tabla
          // this.informacionProducto(productoGuardado.nId); // o lo que apliques
        } else {
          console.log('El usuario cerró el formulario sin guardar.');
        }
      });
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
  this.productosFiltrados=[];
  this.listaProductoBodega=[];
  this.productosAlternativos=[];
  this.listaProductos=[];
  this.banBusquedaCorizaciones=true;



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
      this.saldoGeneralCliente.nSaldoTotal=new Decimal('0');
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
  this.banAlternativos=false;
  
}

imagenError(event: Event) {
  const imgElement = event.target as HTMLImageElement;
  imgElement.src = this.rutaImagenDefault;
}

//Busca información del producto seleccionado
valorSeleccionadoProducto(){
  this.limpiarlistas();  
  this.productoSeleccionado=this.productoSelecionadoCtrl.value;
  this.nIdProducto=this.productoSeleccionado.nId;

  this.rutaImagen = this.rutaImagenDefault;
  this.productoService.resolverImagenProducto(this.productoSeleccionado.sNoParte).subscribe({
    next: (res) => {
      // Usar la URL del backend si existe (aunque encontrada sea false, el fallback sigue siendo válido).
      // El handler (error) del <img> se encarga de mostrar la imagen default si la URL falla en el navegador.
      this.rutaImagen = (res.url && res.url.trim() !== '') ? res.url : this.rutaImagenDefault;
    },
    error: () => {
      this.rutaImagen = this.rutaImagenDefault;
    }
  });
  
  
  //consulta las ubicaciones de los productos
  this.ubicacionProducto(this.productoSeleccionado.nId);
  // obtiene los alternativos del producto   
  this.obtenerProductosAlternativos(this.productoSeleccionado.nId);

  //consulta el total de productos en las bodegas
  this.productoService.obtenerTotalBodegasIdProducto(this.productoSeleccionado.nId).subscribe(productoStock =>{
     
    //Si el producto no tiene inventario lanza un mensaje de advertencia de que no tiene inventario
    if (productoStock.nCantidadTotal === 0) {
      this.messageService.add({severity: 'warn', summary: 'Sin existencias', detail: 'El producto seleccionado no cuenta con existencias.', life: 3000});
    }
    
  // Consulta el precio del producto
    this.calcularPrecio(productoStock);
    //  Asigna el producto a lista de productos filtrados 
    this.productosFiltrados.push(productoStock); 
    // Oculta las sugerencias de producto de la lista
    this.mostrarSugerenciasProducto=false;
    this.productoCtrl.reset();
    this.regreso=false;
  });
}

sumarIncremento(tvStockProducto :TvStockProducto){

  const incremento = this.obtenerIncrementoProducto(tvStockProducto);

  if (incremento.lessThan(this.incrementoMinimo)) {
    this.messageService.add({severity: 'warn', summary: 'Atención', detail: 'Debe agregar un aumento igual ó superior 0', life: 3000});
    return;
  }

  if (!this.tienePrecioBase(tvStockProducto)) {
    this.calcularPrecio(tvStockProducto);
    return;
  }

  if (incremento.equals(this.incrementoMinimo)) {
    this.restaurarPrecioBase(tvStockProducto);
    return;
  }

  this.aplicarIncrementoPorUnidad(tvStockProducto, incremento);
}

calcularPrecio(tvStockProducto :TvStockProducto){


this.productoDescuentoDto=new ProductoDescuentoDto;
this.productoDescuentoDto.tcProducto=tvStockProducto.tcProducto;
this.productoDescuentoDto.tcCliente={
  ...this.clienteSeleccionado,
  nDescuento: this.tieneClienteDescuento()
} as any;


 this.productoService.calcularPrecioProducto(this.productoDescuentoDto).subscribe(data=>{
 
   this.productoNuevoPrecio=data;

   this.actualizarPreciosProducto(tvStockProducto, this.productoNuevoPrecio);
   this.guardarPrecioBase(tvStockProducto);

   const incremento = this.obtenerIncrementoProducto(tvStockProducto);

   if (incremento.greaterThan(this.incrementoMinimo)) {
     this.aplicarIncrementoPorUnidad(tvStockProducto, incremento);
     return;
   }

   this.actualizarTotalesProducto(tvStockProducto);

  this.regreso=true;

  
 })

  return this.productoNuevoPrecio;

}

actualizarIncrementoProducto(tvStockProducto: TvStockProducto, valor: number | string | null) {
  const valorNormalizado = this.normalizarIncremento(valor);
  const incremento = valorNormalizado === ''
    ? new Decimal(0)
    : new Decimal(valorNormalizado);

  this.incrementosPorProducto.set(tvStockProducto.nIdProducto, incremento);
}

obtenerIncrementoProductoValor(tvStockProducto: TvStockProducto): number {
  return this.obtenerIncrementoProducto(tvStockProducto).toNumber();
}

obtenerIncrementoProductoTexto(tvStockProducto: TvStockProducto): string {
  const incremento = this.obtenerIncrementoProducto(tvStockProducto);
  return incremento.isZero() ? '' : incremento.toString();
}

obtenerValorNumerico(valor: Decimal | number | string): number {
  return this.toDecimal(valor).toNumber();
}

formatearPrecio(valor: Decimal | number | string, minimoDecimales: number = 2, maximoDecimales: number = 3): string {
  return new Intl.NumberFormat('es-MX', {
    minimumFractionDigits: minimoDecimales,
    maximumFractionDigits: maximoDecimales
  }).format(this.obtenerValorNumerico(valor));
}

private aplicarIncrementoPorUnidad(tvStockProducto: TvStockProducto, incremento: Decimal) {
  const precioBase = this.preciosBasePorProducto.get(tvStockProducto.nIdProducto);

  if (!precioBase) {
    this.calcularPrecio(tvStockProducto);
    return;
  }

  const totalObjetivo = Decimal.max(
    precioBase.precioConIva,
    precioBase.precioConIva.plus(incremento)
  ).toDecimalPlaces(2, Decimal.ROUND_DOWN);

  const calculaPrecioDto = new CalculaPrecioDto();
  calculaPrecioDto.cantidad = this.obtenerCantidadCalculo(tvStockProducto);
  calculaPrecioDto.precioUnitario = this.calcularPrecioSinIvaObjetivo(totalObjetivo).toNumber();

  this.ventaService.calcularNuevoPrecioAjustado(calculaPrecioDto).subscribe(data => {
    tvStockProducto.tcProducto.nPrecioSinIva = this.toDecimal(data.precioUnitario);
    tvStockProducto.tcProducto.nPrecioIva = this.toDecimal(data.ivaUnitario);
    tvStockProducto.tcProducto.nPrecioConIva = this.toDecimal(data.totalUnitario);
    tvStockProducto.tcProducto.nPrecioPeso = this.toDecimal(data.totalUnitario);
    tvStockProducto.nTotalUnitario = this.toDecimal(data.totalUnitario);
    tvStockProducto.nTotalPartida = this.toDecimal(data.totalPartida);
    this.regreso = true;
  });
}

private restaurarPrecioBase(tvStockProducto: TvStockProducto) {
  const precioBase = this.preciosBasePorProducto.get(tvStockProducto.nIdProducto);

  if (!precioBase) {
    this.calcularPrecio(tvStockProducto);
    return;
  }

  tvStockProducto.tcProducto.nPrecioPeso = precioBase.precioPeso;
  tvStockProducto.tcProducto.nPrecioConIva = precioBase.precioConIva;
  tvStockProducto.tcProducto.nPrecioSinIva = precioBase.precioSinIva;
  tvStockProducto.tcProducto.nPrecioIva = precioBase.precioIva;
  tvStockProducto.tcProducto.sProducto = precioBase.sProducto;
  tvStockProducto.tcProducto.nIdDescuento = precioBase.nIdDescuento;
  tvStockProducto.tcProducto.tcDescuento = precioBase.tcDescuento;
  tvStockProducto.tcProducto.nPrecioOriginal = precioBase.nPrecioOriginal;
  this.actualizarTotalesProducto(tvStockProducto);
  this.regreso = true;
}

private actualizarPreciosProducto(tvStockProducto: TvStockProducto, tcProducto: TcProducto) {
  tvStockProducto.tcProducto.nPrecioPeso = this.toDecimal(tcProducto.nPrecioPeso);
  tvStockProducto.tcProducto.nPrecioConIva = this.toDecimal(tcProducto.nPrecioConIva);
  tvStockProducto.tcProducto.nPrecioSinIva = this.toDecimal(tcProducto.nPrecioSinIva);
  tvStockProducto.tcProducto.nPrecioIva = this.toDecimal(tcProducto.nPrecioIva);
  tvStockProducto.tcProducto.sProducto = tcProducto.sProducto;
  tvStockProducto.tcProducto.nIdDescuento = tcProducto.nIdDescuento;
  tvStockProducto.tcProducto.tcDescuento = tcProducto.tcDescuento;
  tvStockProducto.tcProducto.nPrecioOriginal = tcProducto.nPrecioOriginal;
}

private guardarPrecioBase(tvStockProducto: TvStockProducto) {
  this.preciosBasePorProducto.set(tvStockProducto.nIdProducto, {
    precioPeso: this.toDecimal(tvStockProducto.tcProducto.nPrecioPeso),
    precioConIva: this.toDecimal(tvStockProducto.tcProducto.nPrecioConIva),
    precioSinIva: this.toDecimal(tvStockProducto.tcProducto.nPrecioSinIva),
    precioIva: this.toDecimal(tvStockProducto.tcProducto.nPrecioIva),
    sProducto: tvStockProducto.tcProducto.sProducto,
    nIdDescuento: tvStockProducto.tcProducto.nIdDescuento,
    tcDescuento: tvStockProducto.tcProducto.tcDescuento,
    nPrecioOriginal: tvStockProducto.tcProducto.nPrecioOriginal
  });
}

private actualizarTotalesProducto(tvStockProducto: TvStockProducto) {
  const cantidad = new Decimal(this.obtenerCantidadCalculo(tvStockProducto).toString());
  const precio = this.toDecimal(tvStockProducto.tcProducto.nPrecioSinIva);
  const { totalFinal, precioUnitario } = this.calcularTotales(precio, cantidad);

  tvStockProducto.nTotalUnitario = precioUnitario;
  tvStockProducto.nTotalPartida = totalFinal;
}

private calcularPrecioSinIvaObjetivo(totalObjetivo: Decimal): Decimal {
  let precioSinIva = totalObjetivo.div(this.ivaFactor).toDecimalPlaces(2, Decimal.ROUND_DOWN);
  let totalCalculado = this.calcularTotalConIva(precioSinIva);

  while (totalCalculado.lessThan(totalObjetivo)) {
    precioSinIva = precioSinIva.plus(new Decimal('0.01')).toDecimalPlaces(2, Decimal.ROUND_DOWN);
    totalCalculado = this.calcularTotalConIva(precioSinIva);
  }

  return precioSinIva;
}

private calcularTotalConIva(precioSinIva: Decimal): Decimal {
  const precioTruncado = precioSinIva.toDecimalPlaces(2, Decimal.ROUND_DOWN);
  const iva = precioTruncado.mul(new Decimal('0.16')).toDecimalPlaces(2, Decimal.ROUND_DOWN);
  return precioTruncado.plus(iva).toDecimalPlaces(2, Decimal.ROUND_DOWN);
}

private obtenerCantidadCalculo(tvStockProducto: TvStockProducto): number {
  if (tvStockProducto.nCantidad && tvStockProducto.nCantidad > 0) {
    return tvStockProducto.nCantidad;
  }

  return 1;
}

private obtenerIncrementoProducto(tvStockProducto: TvStockProducto): Decimal {
  return this.incrementosPorProducto.get(tvStockProducto.nIdProducto) ?? new Decimal(0);
}

private tienePrecioBase(tvStockProducto: TvStockProducto): boolean {
  return this.preciosBasePorProducto.has(tvStockProducto.nIdProducto);
}

private tieneClienteDescuento(): boolean {
  const descuento = this.clienteSeleccionado?.nDescuento as any;
  return descuento === true || descuento === 1 || descuento === '1';
}

private toDecimal(valor: Decimal | number | string): Decimal {
  return new Decimal((valor ?? 0).toString());
}

private normalizarIncremento(valor: number | string | null): string {
  if (valor === null || valor === undefined) {
    return '';
  }

  const texto = valor.toString().replace(/,/g, '.');
  const soloPermitidos = texto.replace(/[^\d.]/g, '');
  const partes = soloPermitidos.split('.');

  if (partes.length === 1) {
    return partes[0];
  }

  return `${partes[0]}.${partes.slice(1).join('')}`;
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
      //console.log(productosAlter);
      if(productosAlter.length>0){
       this.banAlternativos=true;

      }
      else{
        this.banAlternativos=false;
      }

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
  const cantidadNumber = this.nCantidadCtrl.value;

  if (!cantidadNumber || cantidadNumber <= 0) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Atención',
      detail: 'Debe agregar una cantidad',
      life: 3000
    });
    return;
  }

  this.rutaImagen = '';
  producto.nCantidad = cantidadNumber;

  const index = this.listaProductos.findIndex(p => p.nIdProducto === producto.nIdProducto);

  if (index >= 0) {
    const productoExistente = this.listaProductos[index];
    const productoActualizado = this.crearProductoActualizado(productoExistente, producto);
    this.listaProductos[index] = productoActualizado;
  } else {
    const nuevoProducto = this.crearProductoActualizado(undefined, producto);
    this.listaProductos.push(nuevoProducto);
  }

  // Convertir a Decimal con precisión desde string
  const precioDecimal = new Decimal(producto.tcProducto.nPrecioSinIva.toString());
  const cantidadDecimal = new Decimal(cantidadNumber.toString());

  const { totalFinal } = this.calcularTotales(precioDecimal, cantidadDecimal);

  // ✅ Sumar y truncar inmediatamente el total acumulado
  this.total = this.calculaTotalCarrito();

  console.log('Total acumulado truncado:', this.total.toFixed(2));

  producto.nCantidadTotal -= cantidadNumber;

  this.resetFormulario();

  this.messageService.add({
    severity: 'success',
    summary: 'Correcto',
    detail: 'Producto Agregado Correctamente',
    life: 3000
  });
}

// 🔁 Cálculo de totales con IVA y truncamiento
private calcularTotales(precio: Decimal, cantidad: Decimal) {
  const iva = new Decimal('0.16');

  const subtotal = precio.mul(cantidad); // sin IVA
  const montoIva = subtotal.mul(iva);    // IVA
  const totalConIva = subtotal.plus(montoIva); // Total

  return {
    subtotalFinal: subtotal.toDecimalPlaces(2, Decimal.ROUND_DOWN),
    ivaFinal: montoIva.toDecimalPlaces(2, Decimal.ROUND_DOWN),
    totalFinal: totalConIva.toDecimalPlaces(2, Decimal.ROUND_DOWN),
    precioUnitario: precio.plus(precio.mul(iva)).toDecimalPlaces(2, Decimal.ROUND_DOWN)
  };
}

// 🧩 Fusiona cantidades y recalcula totales del producto
private crearProductoActualizado(
  productoExistente: TvStockProducto | undefined,
  nuevoProducto: TvStockProducto
): TvStockProducto {
  const cantidadExistente = new Decimal((productoExistente?.nCantidad ?? 0).toString());
  const cantidadNueva = new Decimal(nuevoProducto.nCantidad.toString());
  const cantidadTotal = cantidadExistente.plus(cantidadNueva);

  const precio = new Decimal(nuevoProducto.tcProducto.nPrecioSinIva.toString());
  const { totalFinal, precioUnitario } = this.calcularTotales(precio, cantidadTotal);

  console.log('Total partida:', totalFinal.toFixed(2), 'Precio unitario con IVA:', precioUnitario.toFixed(2));

  return {
    ...nuevoProducto,
    nCantidad: cantidadTotal.toNumber(),
    nTotalUnitario: precioUnitario,
    nTotalPartida: totalFinal
  };
}

// 🔄 Limpia formulario y estado visual
private resetFormulario() {
  this.productosFiltrados = [];
  this.nCantidadCtrl.setValue(0);
  this.nIncrementoCtrl.setValue(0);
  this.muestraProductosBodega = false;
  this.listaProductoBodega = [];
  this.nIdProducto = null;
  this.incrementosPorProducto.clear();
  this.preciosBasePorProducto.clear();
  this.limpiarlistas();
}
modificarCantidad(producto: TvStockProducto, cambio: number): void {
  const nuevaCantidad = new Decimal(producto.nCantidad).plus(cambio);

  if (nuevaCantidad.lessThanOrEqualTo(0)) return;

  producto.nCantidad = nuevaCantidad.toNumber();

  const precio = new Decimal(producto.tcProducto.nPrecioSinIva.toString());
  const { totalFinal, precioUnitario } = this.calcularTotales(precio, nuevaCantidad);

  producto.nTotalUnitario = precioUnitario;
  producto.nTotalPartida = totalFinal;

  this.total = this.calculaTotalCarrito();
}

calculaTotalCarrito(): Decimal {
  return this.listaProductos.reduce((acumulado, item) => {
    return acumulado.plus(new Decimal(item.nTotalPartida.toString()));
  }, new Decimal(0)).toDecimalPlaces(2, Decimal.ROUND_DOWN);
}

quitarProducto(producto: TvStockProducto){
   
  // quita los productos del carrito
  this.listaProductos.splice(this.findIndexById(producto.nIdProducto, this.listaProductos),1);
  this.total = this.calculaTotalCarrito();
}

guardarCotizacion(){

 // console.log(this.listaProductos);



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
    if(this.clienteSeleccionado.nDescuento){
    cotizacionDto.nInDescuento=producto.tcProducto.nIdDescuento;
     }
     else{
      cotizacionDto.nInDescuento=0;
     }
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
  this.total=new Decimal('0');
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
  this.total=new Decimal('0');
  this.mostrarDetalleCliente=false;
  this.mostrarOpcionesVenta=false;
  this.muestraProductos = false;
  this.nIncrementoCtrl.setValue(0);
  this.incrementosPorProducto.clear();
  this.preciosBasePorProducto.clear();


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


mostrarFormularioPreciosUbicacionProveedor(){


  this.mostrarPrecioProveedor=true;



}

}
