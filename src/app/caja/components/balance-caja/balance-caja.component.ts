import { Component, OnInit } from '@angular/core';
import { VentasService } from '../../../shared/service/ventas.service';
import { TvVentasDetalle } from '../../../productos/model/TvVentasDetalle';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-balance-caja',
  templateUrl: './balance-caja.component.html',
  styleUrls: ['./balance-caja.component.scss']
})
export class BalanceCajaComponent implements OnInit {

  listaVentasDetalleCliente:TvVentasDetalle[];
  totalVentas:number=0;
  totalVentasMostrador:number=0;
  totalVentasMostradorPedido:number=0;
  totalVentasInternet:number=0;
  mostrarIndicadores:boolean=false;
  ventasTotal:number=0;
  ventasCreditoTotal:number=0;
  ventasContadoTotal:number=0;
  constructor(private ventasService: VentasService, private messageService: MessageService,) { }

  ngOnInit(): void {

    this.obtenerVentasCajaVigente();
  }

  obtenerVentasCajaVigente(){

    this.ventasService.obtenerVentaDetalleCajaVigente().subscribe(data=>{

      this.listaVentasDetalleCliente=data;
      this.obtenerValores();

    });

    
    

  }

  obtenerValores(){

    this.totalVentas=this.listaVentasDetalleCliente.length;
    //console.log(this.listaVentasDetalleCliente);
    for (let ventas of this.listaVentasDetalleCliente){
     if(ventas.tcTipoVenta.nId==1){

 
      this.totalVentasMostrador=this.totalVentasMostrador+1

     }
     if(ventas.tcTipoVenta.nId==2){

      this.totalVentasInternet=this.totalVentasInternet+1

     }
     if(ventas.tcTipoVenta.nId==3){

      this.totalVentasMostradorPedido=this.totalVentasMostradorPedido+1

     }
     if(ventas.nTipoPago==1){

      this.ventasCreditoTotal=this.ventasCreditoTotal+ventas.nSaldoTotal;

     }
     if(ventas.nTipoPago==0){

      this.ventasContadoTotal=this.ventasContadoTotal+ventas.nSaldoTotal;

     }
     this.ventasTotal= this.ventasTotal+ventas.nSaldoTotal;

  }

  this.mostrarIndicadores=true;

  }

}
