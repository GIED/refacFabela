import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TwFacturasProveedor } from 'src/app/productos/model/TwFacturasProveedor';
import { ProveedorService } from '../../service/proveedor.service';
import { VwFacturasBalanceProveedor } from 'src/app/productos/model/VwFacturasBalanceProveedor';
import { BalanceFacturaProveedorMoneda } from 'src/app/productos/model/BalanceFacturaProveedorMoneda';
import { TwAbonoFacturaProveedor } from '../../../productos/model/TwAbonoFacturaProveedor';

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
  listaAbonos: any[];
  twAbonoFacturaProveedor:TwAbonoFacturaProveedor;

  totalFactura:number=0;
  totalAbonos:number=0;
  saldoFinal:number=0;


  constructor( private messageService: MessageService,
    private confirmationService: ConfirmationService,   private fb: FormBuilder, private proveedorService: ProveedorService) { 
  this.banAbonoFacturaProveedor=false;
  this.twAbonoFacturaProveedor=new TwAbonoFacturaProveedor();

    }

  ngOnInit(): void {
    console.log('Voy a consultar las facturas del proveedor moneda', this.vwFacturasBalanceProveedor );
    this.consultarFacturasProveedorMoneda();
  }

  consultarFacturasProveedorMoneda(){
    
this.proveedorService.getFacturasProveedorMonedaBalance(this.vwFacturasBalanceProveedor).subscribe(data=>{
  this.listaBalalceFacturaMoneda=data;
  console.log('estas son las facturas del proveedor moneda', data);
})
  }

  cerrarDetalle(){

    this.cerrar.emit(false);
   

  }

   crearformulario(balanceFacturaProveedorMoneda: BalanceFacturaProveedorMoneda){
    this.banAbonoFacturaProveedor=true;
    this.balanceFacturaMonedaDTO=balanceFacturaProveedorMoneda;
    this.totalFactura=this.balanceFacturaMonedaDTO.twFacturasProveedor.nMontoFactura;
    this.totalAbonos=this.balanceFacturaMonedaDTO.totalAbonos;
    this.saldoFinal=this.totalFactura-this.totalAbonos;
    

    this.formulario = this.fb.group({
      sMonto: ['', [Validators.required]]
    });



   }


  // Validador para el campo sMonto
  get validasMonto() {
    const control = this.formulario.get('nMonto');
    return control?.invalid && control?.touched;
  }

    // Método para cerrar el diálogo
    hideDialog() {
      this.banAbonoFacturaProveedor = false;
    }

    guardar(  ) {
      if (this.formulario.valid) {
        console.log('Esto es lo que voy a guradar', this.balanceFacturaMonedaDTO);
        this.twAbonoFacturaProveedor.nMontoAbono=this.formulario.get('nMonto').value;
        this.twAbonoFacturaProveedor.nIdFacturaProveedor=this.balanceFacturaMonedaDTO.nId;
        this.twAbonoFacturaProveedor.nEstatusAbono=1;
        this.twAbonoFacturaProveedor.nIdFormaPago=1;
        this.twAbonoFacturaProveedor.nIdUsuario=8;
        this.twAbonoFacturaProveedor.sNota='Esta es una prueba dw registro desde formulario';   
        this.twAbonoFacturaProveedor.dFechaAbono=new Date();    

       this.proveedorService.guardaAbonoFacturaProveedor( this.twAbonoFacturaProveedor).subscribe(data=>{

         if(data!=null || data!=undefined){
          
          this.banAbonoFacturaProveedor=false;
          this.listaBalalceFacturaMoneda=null;
          this.consultarFacturasProveedorMoneda();



         }



       })




        
       // this.hideDialog(); // Cierra el diálogo después de guardar
      } else {
        this.formulario.markAllAsTouched(); // Marca todos los controles como tocados para mostrar los errores
      }
    }

    




}
