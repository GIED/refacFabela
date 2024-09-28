import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { VwFacturasBalanceProveedor } from 'src/app/productos/model/VwFacturasBalanceProveedor';
import { ProveedorService } from '../../service/proveedor.service';
import { DataSerie } from 'src/app/productos/model/DataSerie';
import { TwFacturasProveedor } from 'src/app/productos/model/TwFacturasProveedor';
import { BalanceFacturaProveedorMoneda } from 'src/app/productos/model/BalanceFacturaProveedorMoneda';

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
  mostrarFormulario:boolean=false;
  titulo:string;
  detalleFacturasProveedor:boolean=false;
  vwFacturasBalanceProveedor:VwFacturasBalanceProveedor;
  listaFacturasSinCobrar:BalanceFacturaProveedorMoneda[];
  totalVencidos:number=0;
  totalRegulares:number=0;
  montoFactura:number=0;
  montoAbono:number=0;
  mostrarHistorial:boolean=false;


  constructor( private messageService: MessageService,
    private confirmationService: ConfirmationService,   private fb: FormBuilder, private proveedorService: ProveedorService) {
      this.datoCambio=new DataSerie();
      this.listaFacturasSinCobrar=[];
     }

  ngOnInit(): void {
    this.cargainicial();
    


  }


  cargainicial(){

    this.titulo='Registro de facturas del proveedor'

    this.datoCambio=new DataSerie();
    this.proveedorService.getTipoCambioBM().subscribe(data2=>{
      this.datoCambio=data2;
      if(data2 == null || data2 == undefined){
        this.datoCambio= new DataSerie();
        this,this.datoCambio.dato=20;
      }
    })




    this.proveedorService.getBalanceFacturasProveedores().subscribe(data=>{

      this.listaBalalceProveedores=data;


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

   

      this.obtenerFacturasSinPagar();

    })

  }

  abrirFormulario(){
  
    this.mostrarFormulario=true;
 
  }

  inicializarBalance(){
    this.listaBalalceProveedores=null;
    this.totalFacturasPeso=0;
    this.totalAbonosPeso=0;
    this.saldoPendientePagoPeso=0 ;
    this.totalFacturasUsd=0;
    this.totalAbonosUsd=0;
    this.saldoPendientePagoUsd=0
    this.cambio=0
    this.datoCambio=null;
    this.totalRegulares=0;
    this.totalVencidos=0;
  }
  
  cerrarDialogo(){

   this.inicializarBalance();
   this.detalleFacturasProveedor=false;

    this.mostrarFormulario=false;
    this.cargainicial();


  }

  abrirhistorial(){
    this.mostrarHistorial=true;    
  }

  consultarDetalleFacturaMonedas(vwFacturasBalanceProveedor: VwFacturasBalanceProveedor){

    this.detalleFacturasProveedor=true;
    this.vwFacturasBalanceProveedor=vwFacturasBalanceProveedor;

  }

  obtenerFacturasSinPagar(){


   this.proveedorService.getFacturasSinCobrar().subscribe(facturas=>{
   
    this.listaFacturasSinCobrar=facturas;
    

    for (let index = 0; index < this.listaFacturasSinCobrar.length; index++) {
      this.montoFactura=0;
      this.montoAbono=0;

      if (this.listaFacturasSinCobrar[index].twFacturasProveedor.nIdMoneda=== 2) {
       this.montoFactura = this.listaFacturasSinCobrar[index].twFacturasProveedor.nMontoFactura*this.datoCambio.dato;  // Multiplica por el tipo de cambio si es USD
       this.montoAbono = this.listaFacturasSinCobrar[index].totalAbonos*this.datoCambio.dato;
      }
      else{
        this.montoFactura=this.listaFacturasSinCobrar[index].twFacturasProveedor.nMontoFactura;
        this.montoAbono = this.listaFacturasSinCobrar[index].totalAbonos;


      }
      
      if(this.listaFacturasSinCobrar[index].estatusFactura=='PAGO VENCIDO'){
      this.totalVencidos +=  this.montoFactura-this.montoAbono;
       }
       if(this.listaFacturasSinCobrar[index].estatusFactura=='POR PAGAR'){
        this.totalRegulares += this.montoFactura-this.montoAbono;
         }
      
      }

 



   })



  }

}
