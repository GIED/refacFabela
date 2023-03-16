import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService} from 'primeng/api';
import { TvVentasDetalle } from 'src/app/productos/model/TvVentasDetalle';
import { VentasService } from 'src/app/shared/service/ventas.service';
import { ClienteService } from '../../service/cliente.service';
import { TwVenta } from '../../../productos/model/TwVenta';
import { TcCliente } from '../../model/TcCliente';
import { SaldoGeneralCliente } from '../../../ventasycotizaciones/model/TvSaldoGeneralCliente';

@Component({
  selector: 'app-traspaso-venta-acredito',
  templateUrl: './traspaso-venta-acredito.component.html',
  styleUrls: ['./traspaso-venta-acredito.component.scss']
})
export class TraspasoVentaACreditoComponent implements OnInit {

  listaVentasDetalleCliente: TvVentasDetalle[];
  listaFiltrada: TvVentasDetalle[];
  cols: any[];
  buscar:string;
  twVenta:TwVenta;
  tcCliente:TcCliente;
  saldoGeneralCliente: SaldoGeneralCliente;

  constructor(private ventasService:VentasService,  
    private _confirmationService : ConfirmationService, 
    private _clienteService:ClienteService,
    private _toastr: MessageService,) {
    this.listaFiltrada=[];
    this.twVenta= new TwVenta();
    this.tcCliente= new TcCliente();
    this.saldoGeneralCliente= new SaldoGeneralCliente;

    this.cols = [
      { field: 'sFolioVenta', header: 'Folio' },
      { field: 'tcCliente.sRfc', header: 'RFC' },
      { field: 'tcCliente.sRazonSocial', header: 'Razón Social' },
      { field: 'nTotalVenta', header: 'Total Venta' },
      { field: 'dFechaVenta', header: 'Fecha de Venta' },
      { field: 'tcUsuario.sNombreUsuario', header: 'Vendedor' },
     
  ]

   }

  ngOnInit(): void {
    this.obtenerVentasTop();
  }

  obtenerVentasTop(){
    this.ventasService.obtenerVentasTop().subscribe(data=>{
      this.listaVentasDetalleCliente=data; 

      this.listaFiltrada=this.listaVentasDetalleCliente.filter(t => (t.nTipoPago == 0) && (t.tcEstatusVenta.nId == 1 || t.tcEstatusVenta.nId == 2));
      //console.log(this.listaVentasDetalleCliente);      
      
     }); 
  }

  consultar(){

    
      this.ventasService.obtenerVentasLike(this.buscar).subscribe(data => {
        this.listaVentasDetalleCliente=data;
        //console.log(this.listaVentasDetalleCliente);
      }); 
  
   
  }

  consultarTodas(){

   
      this.ventasService.obtenerVentaDetalle().subscribe(data => {
        this.listaVentasDetalleCliente=data;
        
      }); 
  
    
  }


  traspasarVentaACredito(tvVentaDetalle: TvVentasDetalle) {
    this._confirmationService.confirm({
      header: 'Confirmación',
      message: 'Estas seguro de cambiar la venta a venta de credito',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: "Aceptar", acceptIcon: "pi pi-check", acceptButtonStyleClass: 'p-button-success p-button-sm p-button-raised',
      rejectLabel: "Rechazar", rejectIcon: "pi pi-times", rejectButtonStyleClass: 'p-button-outlined p-button-danger p-button-sm',
      accept: () => {
            console.log(tvVentaDetalle);

            this._clienteService.consultaClienteId(tvVentaDetalle.nIdCliente).subscribe(resp =>{
                this.tcCliente = resp;
                console.log('cliente: ',this.tcCliente);
                if (this.tcCliente.n_limiteCredito > 0) {

                  this._clienteService.obtenerSaldoGeneralCliente(tvVentaDetalle.nIdCliente).subscribe(resp =>{

                    this.saldoGeneralCliente=resp;

                    console.log('this.saldoGeneralCliente',this.saldoGeneralCliente);

                    if (this.saldoGeneralCliente == null || (this.saldoGeneralCliente.nCreditoDisponible > tvVentaDetalle.nSaldoTotal)) {

                      this.ventasService.obtnerVentaId(tvVentaDetalle.nId).subscribe(resp =>{
                       
    
                        this.twVenta = resp;
    
                        this.twVenta.nTipoPago = 1;
                        this.twVenta.dFechaInicioCredito=new Date();
                        var fin = new Date();
                            fin.setDate(fin.getDate() + 30);
                        this.twVenta.dFechaTerminoCredito=fin;
                        this.twVenta.nIdEstatusVenta=2;
    
                        this.ventasService.cambiarVentaACredito(this.twVenta).subscribe(resp =>{
                          console.log('venta actualizada: ',resp);
                          this._toastr.add({
                            severity: "success",
                            summary: "Venta Cambiada",
                            detail: " venta se paso a venta a credito de forma correcta.",
                          });
                          this.obtenerVentasTop();
                        })  
                      });                  
                    }else{
                      this._toastr.add({
                        severity: "error",
                        summary: "Error",
                        detail: "El cliente no cuenta con credito disponible.",
                      });
                    }

                  });
                }else{
                  this._toastr.add({
                    severity: "error",
                    summary: "Error",
                    detail: "El cliente no cuenta con una linea de credito activa.",
                  });
                }
            });   
      }
    });
  }



}
