import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TwFacturasProveedor } from 'src/app/productos/model/TwFacturasProveedor';
import { ProveedorService } from '../../service/proveedor.service';
import { VwFacturasBalanceProveedor } from 'src/app/productos/model/VwFacturasBalanceProveedor';
import { BalanceFacturaProveedorMoneda } from 'src/app/productos/model/BalanceFacturaProveedorMoneda';
import { TwAbonoFacturaProveedor } from '../../../productos/model/TwAbonoFacturaProveedor';
import { CatalogoService } from '../../../shared/service/catalogo.service';
import { TcFormaPago } from 'src/app/productos/model/TcFormaPago';
import { AuthService } from '../../../shared/service/auth.service';
import { TokenService } from '../../../shared/service/token.service';
import { Observable } from 'rxjs';
import { ReturnStatement } from '@angular/compiler';
import { DatosFacturaDto } from 'src/app/productos/model/DatosFacturaDto';
import { ClienteService } from '../../service/cliente.service';
import { TcCuentaBancaria } from 'src/app/productos/model/TcCuentaBancaria';

@Component({
  selector: 'app-factura-moneda-proveedor',
  templateUrl: './factura-moneda-proveedor.component.html',
  styleUrls: ['./factura-moneda-proveedor.component.scss']
})
export class FacturaMonedaProveedorComponent implements OnInit {

  @Output() cerrar: EventEmitter<boolean>= new EventEmitter();
  @Input() vwFacturasBalanceProveedor: VwFacturasBalanceProveedor;


  listafacturasMoneda:TwFacturasProveedor[];
  listaBalalceFacturaMoneda: BalanceFacturaProveedorMoneda[];

  formulario: FormGroup;
  banAbonoFacturaProveedor: boolean = false;
  balanceFacturaMonedaDTO:BalanceFacturaProveedorMoneda;
  listaAbonos: TwAbonoFacturaProveedor[];
  twAbonoFacturaProveedor:TwAbonoFacturaProveedor;
  twFacturaProveedor:TwFacturasProveedor;

  totalFactura:number=0;
  totalAbonos:number=0;
  saldoFinal:number=0;
  listaFormaPago:TcFormaPago[];
  banTablaAbonos: boolean=false;
  listaDatosFactura:DatosFacturaDto[];
  listaCuentasBancarias:TcCuentaBancaria[];


  constructor( private messageService: MessageService,
   private catalogoService:CatalogoService, private _tokenService: TokenService,   private fb: FormBuilder, private proveedorService: ProveedorService,
    
  ) { 
  this.banAbonoFacturaProveedor=false;
  this.twAbonoFacturaProveedor=new TwAbonoFacturaProveedor();
  this.listaAbonos=[];
  this.listaDatosFactura=[];
  this.listaCuentasBancarias=[];

    }

  ngOnInit(): void {

    this.getFacturasProveedorMoneda();
    this.getFormasPago();
 

  }

  
  consultarCuentasBancariasRazon(nIdRazonSocial:number){


    this.catalogoService.getCuentasBanciariasRazon(nIdRazonSocial).subscribe(data5 => {
      this.listaCuentasBancarias = data5;

      this.listaCuentasBancarias = this.listaCuentasBancarias.map(cuenta => ({
        ...cuenta,
        displayLabel: `${cuenta.sBanco} - ${cuenta.sTerminacion}`
      }));
      console.log(data5);
    });


  }



  // INICIA CON LA CREACIÓN DEL FORMULARIO 
   crearformulario(balanceFacturaProveedorMoneda: BalanceFacturaProveedorMoneda){
    
    // SE ASIGNAN LOS VALORES DE LOS TOTALES DE LA FACTURA
    this.banAbonoFacturaProveedor=true;
    this.balanceFacturaMonedaDTO=balanceFacturaProveedorMoneda;
    this.totalFactura=this.balanceFacturaMonedaDTO.twFacturasProveedor.nMontoFactura;
    this.totalAbonos=this.balanceFacturaMonedaDTO.totalAbonos;
    this.saldoFinal=this.totalFactura-this.totalAbonos;
    
    // CREA EL FORMULARIO
    this.formulario = this.fb.group({
      nMonto: ['', [Validators.required]],
      idFormaPago: ['', [Validators.required]],
      idCuentaBancaria: ['', [Validators.required]],
      sNota: ['', [Validators.required]]
    });  

    this.consultarCuentasBancariasRazon(this.balanceFacturaMonedaDTO.twFacturasProveedor.nIdRazonSocial);

   

    // CONSULTA LOS ABONOS DE LA FACTURA SELECCIONADA
    this.getAbonosFactura(balanceFacturaProveedorMoneda.nId);

    
   }


  // SE  VALIDAN LOS CAMPOS
  get validasMonto() {
    const control = this.formulario.get('nMonto');
    return control?.invalid && control?.touched;
  }
  get validaFormaPago() {
    const control = this.formulario.get('idFormaPago');
    return control?.invalid && control?.touched;
  }

  get validaCuentaBancaria() {
    const control = this.formulario.get('idCuentaBancaria');
    return control?.invalid && control?.touched;
  }
  get validaNota() {
    const control = this.formulario.get('sNota');
    return control?.invalid && control?.touched;
  }

   
   

    

  guardar() {
    if (this.formulario.valid) {

      if (this.saldoFinal >= this.formulario.get('nMonto').value) {
        this.twAbonoFacturaProveedor.nMontoAbono = this.formulario.get('nMonto').value;
        this.twAbonoFacturaProveedor.nIdFacturaProveedor = this.balanceFacturaMonedaDTO.nId;
        this.twAbonoFacturaProveedor.nEstatusAbono = 1;
        this.twAbonoFacturaProveedor.nIdFormaPago = this.formulario.get('idFormaPago').value;
        this.twAbonoFacturaProveedor.nIdCuentaBancaria = this.formulario.get('idCuentaBancaria').value;
        this.twAbonoFacturaProveedor.nIdUsuario = this._tokenService.getIdUser();
        this.twAbonoFacturaProveedor.sNota = this.formulario.get('sNota').value;;
        this.twAbonoFacturaProveedor.dFechaAbono = new Date();

        //GUARDO EL ABONO DE LA FACTURA 
        this.proveedorService.guardaAbonoFacturaProveedor(this.twAbonoFacturaProveedor).subscribe(data => {

          if (data != null || data != undefined) {

            this.banAbonoFacturaProveedor = false;
            this.listaBalalceFacturaMoneda = null;
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Se guardo el abono de la fatura', life: 3000 });

            //CONSULTO EL BALANCE DE LA FACTURA PARA SABER SI YA ESTÁ PAGADA COMPLETA LA FACTURA 
            this.proveedorService.getBalanceFactura(this.twAbonoFacturaProveedor.nIdFacturaProveedor).subscribe(data2 => {

              // SI LA SUMA DE LOS ABONOS SON IGUALES AL TOTAL DE LA FACTURA
              if (data2.totalAbonos == data2.twFacturasProveedor.nMontoFactura) {

                // SE CONSULTA EL OBJETO DE FACTURA DEL PROVEEDOR 
                this.proveedorService.getFacturaProveedor(this.twAbonoFacturaProveedor.nIdFacturaProveedor).subscribe(data3 => {
                  this.twFacturaProveedor = data3;
                  // SE CAMBIA EL ESTATUS DE LA FACTURA DEL PROVEEDOR 
                  this.twFacturaProveedor.dFechaPagoFactura = new Date();
                  this.twFacturaProveedor.nEstatusFacturaProveedor = 2;
                  // SE GUARDA LA FACTURA Y SE CIERRA EL FORMULARIO
                  this.proveedorService.guardaFacturaProveedor(this.twFacturaProveedor).subscribe(data4 => {
                    this.twFacturaProveedor = data4;
                    this.cerrarDetalle();
                    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'la factura se liquido con éxito', life: 3000 });

                  })

                })
              }
              else{

                this.cerrarDetalle();


              }
            })
          }
          else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se puedo guardar el abono de la factura', life: 3000 });
          }
        })
      }
      else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se puede guardar el abono porque es mayor a adeudo total', life: 3000 });
      }
      // this.hideDialog(); // Cierra el diálogo después de guardar
    } else {
      this.formulario.markAllAsTouched(); // Marca todos los controles como tocados para mostrar los errores
    }
  }

  


  //SE OBTIENE LAS FORMAS DE PAGO
  getFormasPago(){   
    this.catalogoService.obtenerFormaPago().subscribe(data=>{      
      this.listaFormaPago=data;
    },
    error => {
      console.error('Error al obtener las formas de pago:', error);  // Manejo de errores
    })
  }

  // CONSULTA LOS CLIENTES CON ALGUNA FACTURA ACTIVA COMO CARGA DE INICIO
  getFacturasProveedorMoneda() {
    this.proveedorService.getFacturasProveedorMonedaBalance(this.vwFacturasBalanceProveedor).subscribe(data => {
      this.listaBalalceFacturaMoneda = data;
      
    })
  }
    // CIERRA EL MODAL
    cerrarDetalle(){
      this.cerrar.emit(false);
      }



  getAbonosFactura(nId:number){

// CONSULTA LOS ABONOS DE LAS FACTURAS
this.proveedorService.getAbonosFacturaProveedor(nId).subscribe(
  data => {
    this.listaAbonos = data || [];  // Si data es null o undefined, asigna un array vacío
    this.banTablaAbonos = this.listaAbonos.length > 0;  // Si hay elementos, habilita la tabla
  },
  error => {
    console.error('Error al obtener los abonos:', error);
    this.banTablaAbonos = false;  // Si hay un error, deshabilita la tabla
  }
);
  }

   // Método para cerrar el diálogo
   hideDialog() {

    this.onReset();
    this.listaAbonos=null;      
    this.banAbonoFacturaProveedor = false;
  }
  
  // INICIALIZA EL FORMULARIO 
  onReset() {
    this.formulario.reset();      
  }
    




}
