import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TwFacturasProveedor } from 'src/app/productos/model/TwFacturasProveedor';
import { ProveedorService } from '../../service/proveedor.service';
import { VwFacturasBalanceProveedor } from 'src/app/productos/model/VwFacturasBalanceProveedor';

@Component({
  selector: 'app-factura-moneda-proveedor',
  templateUrl: './factura-moneda-proveedor.component.html',
  styleUrls: ['./factura-moneda-proveedor.component.scss']
})
export class FacturaMonedaProveedorComponent implements OnInit {

  @Output() cerrar: EventEmitter<boolean>= new EventEmitter();
  @Input() vwFacturasBalanceProveedor: VwFacturasBalanceProveedor;


  listafacturasMoneda:TwFacturasProveedor[];
  constructor( private messageService: MessageService,
    private confirmationService: ConfirmationService,   private fb: FormBuilder, private proveedorService: ProveedorService) { }

  ngOnInit(): void {
    console.log('Voy a consultar las facturas del proveedor moneda', this.vwFacturasBalanceProveedor );
    this.consultarFacturasProveedorMoneda();
  }

  consultarFacturasProveedorMoneda(){
    
this.proveedorService.getFacturasProveedorMoneda(this.vwFacturasBalanceProveedor).subscribe(data=>{
  console.log('estas son las facturas del proveedor moneda', data);
})
  }

  cerrarDetalle(){

    this.cerrar.emit(false);
   

  }

}
