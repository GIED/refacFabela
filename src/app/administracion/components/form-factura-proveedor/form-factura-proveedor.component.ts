import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CatalogoService } from 'src/app/shared/service/catalogo.service';
import { UsuarioService } from '../../service/usuario.service';
import { TokenService } from 'src/app/shared/service/token.service';
import { ProveedorService } from '../../service/proveedor.service';
import { Proveedores } from '../../interfaces/proveedores';
import { TcMoneda } from 'src/app/productos/model/TcMoneda';
import { TwFacturasProveedor } from '../../../productos/model/TwFacturasProveedor';

@Component({
  selector: 'app-form-factura-proveedor',
  templateUrl: './form-factura-proveedor.component.html',
  styleUrls: ['./form-factura-proveedor.component.scss']
})
export class FormFacturaProveedorComponent implements OnInit {

   
  @Output() cerrar: EventEmitter<boolean>= new EventEmitter();

  formulario:FormGroup;
  listaProvedores: Proveedores[];
  listaMonedas: TcMoneda[];
  twFacturasProveedor:TwFacturasProveedor;
  constructor(

    private fb: FormBuilder, 
              private catalogoService: CatalogoService,             
              private messageService: MessageService,
              private usuarioService: UsuarioService,
              private tokenService: TokenService, 
              private proveedorService: ProveedorService
  ) {

    this.twFacturasProveedor=new TwFacturasProveedor();
   }

  ngOnInit(): void {
    this.consultaproveedores();
    this.getMonegas();

    this.crearFormulario();
  }

  getMonegas(){
    this.catalogoService.obtenerMonedas().subscribe(data2=>{
      this.listaMonedas=data2;
      console.log(this.listaMonedas);
    })
  }

  consultaproveedores(){

  this.proveedorService.getProveedores().subscribe(data=>{
   
    this.listaProvedores=data;
    console.log(this,this.listaProvedores);

  })

  }


  crearFormulario() {
  
    this.formulario = this.fb.group({
      /*nId: ['', []],*/
      s_folio_factura: ['', [Validators.required]],
      n_id_proveedor: ['', [Validators.required]],
      d_fecha_inicio_factura: ['', []],
      d_fecha_termino_factura: ['', [Validators.required]],      
      /* n_id_usuario: ['', [Validators.required]],      
      n_estatus_factura_proveedor: ['', [Validators.required]],
      d_fecha_pago_factura: ['', []], */
      n_monto_factura: ['', [Validators.required]],
      n_id_moneda: ['', [Validators.required]],
      s_nota: ['', [Validators.required]],
    })
    
  }
 /*
  get validanId() {
    return this.formulario.get('nId').invalid && this.formulario.get('nId').touched;
  } */
  
  get validaSFolioFactura() {
    return this.formulario.get('s_folio_factura').invalid && this.formulario.get('s_folio_factura').touched;
  }
  
  get validaNIdProveedor() {
    return this.formulario.get('n_id_proveedor').invalid && this.formulario.get('n_id_proveedor').touched;
  }
  
  get validaDFechaInicioFactura() {
    return this.formulario.get('d_fecha_inicio_factura').invalid && this.formulario.get('d_fecha_inicio_factura').touched;
  }
  
  get validaDFechaTerminoFactura() {
    return this.formulario.get('d_fecha_termino_factura').invalid && this.formulario.get('d_fecha_termino_factura').touched;
  }
  /*
  get validaNIdUsuario() {
    return this.formulario.get('n_id_usuario').invalid && this.formulario.get('n_id_usuario').touched;
  }
  
  get validaNEstatusFacturaProveedor() {
    return this.formulario.get('n_estatus_factura_proveedor').invalid && this.formulario.get('n_estatus_factura_proveedor').touched;
  }
  
  get validaDFechaPagoFactura() {
    return this.formulario.get('d_fecha_pago_factura').invalid && this.formulario.get('d_fecha_pago_factura').touched;
  } */
  
  get validaNMontoFactura() {
    return this.formulario.get('n_monto_factura').invalid && this.formulario.get('n_monto_factura').touched;
  }
  
  get validaNIdMoneda() {
    return this.formulario.get('n_id_moneda').invalid && this.formulario.get('n_id_moneda').touched;
  }
  
  get validaSNota() {
    return this.formulario.get('s_nota').invalid && this.formulario.get('s_nota').touched;
  }

  get fProducto(){
    return this.formulario.controls;
}

cerrarModal(){
  this.cerrar.emit(false);
  this.limpiarFormulario();


}

saveFactura(){

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
    
   this.twFacturasProveedor.sFolioFactura= this.formulario.get('s_folio_factura').value;  
   this.twFacturasProveedor.dFechaInicioFactura= this.formulario.get('d_fecha_inicio_factura').value;
   this.twFacturasProveedor.dFechaTerminoFactura=this.formulario.get('d_fecha_termino_factura').value;
   this.twFacturasProveedor.nIdProveedor=this.formulario.get('n_id_proveedor').value;
   this.twFacturasProveedor.nIdMoneda=this.formulario.get('n_id_moneda').value;
   this.twFacturasProveedor.nMontoFactura=this.formulario.get('n_monto_factura').value;
   this.twFacturasProveedor.nEstatusFacturaProveedor=1;
   this.twFacturasProveedor.nIdUsuario=this.tokenService.getIdUser();
   this.twFacturasProveedor.sNota=this.formulario.get('s_nota').value;

    
    this.proveedorService.guardaFacturaProveedor(this.twFacturasProveedor).subscribe(data=>{

      console.log('esto es lo que guarde',data);
      this.limpiarFormulario();
      this.cerrar.emit(false);

    }) 

      console.log( this.twFacturasProveedor);
    
  }
  
}

limpiarFormulario() {
  this.formulario.reset();
}



}
