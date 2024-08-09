import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { VwFacturasBalanceProveedor } from 'src/app/productos/model/VwFacturasBalanceProveedor';
import { ProveedorService } from '../../service/proveedor.service';
import { DataSerie } from 'src/app/productos/model/DataSerie';

@Component({
  selector: 'app-facturas-proveedor',
  templateUrl: './facturas-proveedor.component.html',
  styleUrls: ['./facturas-proveedor.component.scss']
})
export class FacturasProveedorComponent implements OnInit {

  listaBalalceProveedores: VwFacturasBalanceProveedor[];

 

  totalFacturasPeso:number=0;
  totalAbonosPeso:number=0;
  saldoPendientePagoPeso: number=0;

  totalFacturasUsd:number=0;
  totalAbonosUsd:number=0;
  saldoPendientePagoUsd: number=0;
  cambio:number=0;
  datoCambio:DataSerie;


  constructor( private messageService: MessageService,
    private confirmationService: ConfirmationService,   private fb: FormBuilder, private proveedorService: ProveedorService) {
      this.datoCambio=new DataSerie();
     }

  ngOnInit(): void {

      
    this.proveedorService.getTipoCambioBM().subscribe(data2=>{
      console.log(data2);
      this.datoCambio=data2;
    })




    this.proveedorService.getBalanceFacturasProveedores().subscribe(data=>{

      this.listaBalalceProveedores=data;
      console.log(this.listaBalalceProveedores);


      for (let index = 0; index < this.listaBalalceProveedores.length; index++) {
       
        if(this.listaBalalceProveedores[index].id.nIdMoneda==1){
        this.totalFacturasPeso+=this.listaBalalceProveedores[index].totalFacturas;
        this.totalAbonosPeso+=this.listaBalalceProveedores[index].totalAbonos;
        this.saldoPendientePagoPeso+=this.listaBalalceProveedores[index].saldoPendientePago;
        }

        if(this.listaBalalceProveedores[index].id.nIdMoneda==2){
          this.totalFacturasUsd+=this.listaBalalceProveedores[index].totalFacturas;
          this.totalAbonosUsd+=this.listaBalalceProveedores[index].totalAbonos;
          this.saldoPendientePagoUsd+=this.listaBalalceProveedores[index].saldoPendientePago;
          }
        
      }


      console.log(this.totalFacturasPeso);
      console.log(this.totalAbonosPeso);
      console.log(this.saldoPendientePagoPeso);

      console.log(this.totalFacturasUsd);
      console.log(this.totalAbonosUsd);
      console.log(this.saldoPendientePagoUsd);





     




    })


  }

}
