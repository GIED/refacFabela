import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ProveedorService } from '../../service/proveedor.service';
import { Proveedores } from '../../interfaces/proveedores';
import { TcMoneda } from 'src/app/productos/model/TcMoneda';
import { CatalogoService } from 'src/app/shared/service/catalogo.service';
import { BalanceFacturaProveedorMoneda } from 'src/app/productos/model/BalanceFacturaProveedorMoneda';
import { TwAbonoFacturaProveedor } from 'src/app/productos/model/TwAbonoFacturaProveedor';

@Component({
  selector: 'app-historia-factura-proveedor',
  templateUrl: './historia-factura-proveedor.component.html',
  styleUrls: ['./historia-factura-proveedor.component.scss']
})
export class HistoriaFacturaProveedorComponent implements OnInit {

  @Output() cerrar: EventEmitter<boolean> = new EventEmitter();
  formulario: FormGroup;
  listaProvedores: Proveedores[];
  listaMonedas: TcMoneda[];
  listaAbonos: TwAbonoFacturaProveedor[];
  banAbonoFacturaProveedor: boolean = false;
  cols:any;
  listaHistorialFactura:  BalanceFacturaProveedorMoneda[] = [];




  constructor(private messageService: MessageService,
    private confirmationService: ConfirmationService, private fb: FormBuilder, private proveedorService: ProveedorService, private catalogoService: CatalogoService) {
      this.listaHistorialFactura=[];
      this.cols = [
        { field: 'twFacturasProveedor.sFolioFactura', header: 'Folio' },
        { field: 'twFacturasProveedor.tcProveedore.sRfc', header: 'rfc' },
        { field: 'twFacturasProveedor.tcProveedore.sRazonSocial', header: 'razon' },
        { field: 'twFacturasProveedor.dFechaInicioFactura', header: 'fecha inicio' },
        { field: 'twFacturasProveedor.dFechaTerminoFactura', header: 'termino factura' },
        { field: 'twFacturasProveedor.tcMoneda.sMoneda', header: 'moneda' },
        { field: 'twFacturasProveedor.nMontoFactura', header: 'monto' },
        { field: 'totalAbonos', header: 'total abonos' },
        { field: 'estatusFactura', header: 'estatus factura' },
        { field: 'twFacturasProveedor.dFechaPagoFactura', header: 'fecha pago' }       

    ]

     }

  ngOnInit() {

    this.consultaproveedores();
    this.getMonegas();



    this.formulario = this.fb.group({
      n_id_proveedor: [null, Validators.required],
      n_id_moneda: [null, Validators.required]
    });
  }
  cerrarDetalle(){
    this.cerrar.emit(false);
    }



  getMonegas() {
    this.catalogoService.obtenerMonedas().subscribe(data2 => {
      this.listaMonedas = data2;

    })
  }

  consultaproveedores() {

    this.proveedorService.getProveedores().subscribe(data => {

      this.listaProvedores = data;


    })

  }
  get validaNIdProveedor() {
    return this.formulario.get('n_id_proveedor').invalid && this.formulario.get('n_id_proveedor').touched;
  }
  get validaNIdMoneda() {
    return this.formulario.get('n_id_moneda').invalid && this.formulario.get('n_id_moneda').touched;
  }
  get fProducto(){
    return this.formulario.controls;
}



  onSubmit(): void {
    if (this.formulario.invalid) {
  
      return Object.values(this.formulario.controls).forEach(control => {
  
        if (control instanceof FormGroup) {
          // tslint:disable-next-line: no-shadowed-variable
          
          Object.values(control.controls).forEach(control => control.markAsTouched());
        } else {
          control.markAsTouched();
        }
  
      });
    }else{ 
      this.formulario.markAllAsTouched(); // Marca todos los campos como tocados

      this.listaHistorialFactura=[];
      
      this.proveedorService.getFacturasProveedorMonedaBalanceHistoria(this.formulario.get('n_id_proveedor').value, this.formulario.get('n_id_moneda').value).subscribe(data=>{       
        this.listaHistorialFactura=data;
        this.formulario.reset();

      })
    }
  }

  getAbonosFactura(nId:number){
    this.banAbonoFacturaProveedor=true;

    // CONSULTA LOS ABONOS DE LAS FACTURAS
    this.proveedorService.getAbonosFacturaProveedor(nId).subscribe(
       
      data => {
        
        this.listaAbonos = data || [];  // Si data es null o undefined, asigna un array vacío
       
      },
      error => {
        console.error('Error al obtener los abonos:', error);
      
      }
    );
      }




}
