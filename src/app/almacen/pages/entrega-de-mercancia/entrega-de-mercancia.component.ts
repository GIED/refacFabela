import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MessageService } from "primeng/api";

import { TcFormaPago } from "src/app/productos/model/TcFormaPago";
import { TvVentasDetalle } from "src/app/productos/model/TvVentasDetalle";

import { VentasService } from "src/app/shared/service/ventas.service";
import { VentaProductoDto } from "src/app/ventasycotizaciones/model/dto/VentaProductoDto";
import { TwVentasProductosTraer } from '../../../productos/model/TwVentasProductosTraer';
import { TokenService } from "src/app/shared/service/token.service";

@Component({
  selector: "app-entrega-de-mercancia",
  templateUrl: "./entrega-de-mercancia.component.html",
  styleUrls: ["./entrega-de-mercancia.component.scss"],
})
export class EntregaDeMercanciaComponent implements OnInit {
  titulo: string;

  /*objetos definitivos  */
  listaVentasDetalleCliente: TvVentasDetalle[];
  mostrarProductos: boolean;
  listaProductosVenta: VentaProductoDto;
  abrirformulario: boolean;
  VentaDescuentoDto: TvVentasDetalle;
  formulario: FormGroup;
  cols: any[];
  listaFormaPago: TcFormaPago[];
  noVenta: number;
  totalVenta: number;
  selectedProducts2: VentaProductoDto;
  listaVentasProductosTraer: TwVentasProductosTraer[];
  botonProductosTraer:boolean=false;
  mostrarDialogTraer:boolean=false;
  buscar:string;
  IdUsuario:number;
  mostrarAjustes:boolean

  constructor(
    private messageService: MessageService,
    private ventasService: VentasService,
    private fb: FormBuilder,
    private tokenService: TokenService
  ) {
  this.listaVentasProductosTraer=[];
  this.botonProductosTraer=false;
    this.mostrarDialogTraer=false;
  }

  ngOnInit() {
    this.consultaVentas();

    this.IdUsuario=this.tokenService.getIdUser();

    if(this.IdUsuario==19 || this.IdUsuario==23  || this.IdUsuario==8 || this.IdUsuario==27 || this.IdUsuario==26 ){

      this.mostrarAjustes=true;

    }
    else{
      this.mostrarAjustes=false;
    }
  }

  consultaVentas() {
    this.ventasService.obtenerVentaDetalleEstatusVenta(2).subscribe((data) => {
      this.listaVentasDetalleCliente = data;
      //console.log(this.listaVentasDetalleCliente);
    });
  }

  consultar(){

    if(this.buscar !== undefined && this.buscar.length >=1 ){
      this.ventasService.obtenerVentasLike(this.buscar).subscribe(data => {
        this.listaVentasDetalleCliente=data;
        //console.log(this.listaVentasDetalleCliente);
      }); 
  
    }
    else 
    {
     
    }
  
    
  
   
  
  }

  detalleVentaProductos(tvVentasDetalle: TvVentasDetalle) {
    this.mostrarProductos = true;

    this.ventasService
      .obtenerProductoVentaId(tvVentasDetalle.nId)
      .subscribe((data) => {
        this.listaProductosVenta = data;
      });

     // console.log(tvVentasDetalle.nId);


      this.ventasService
      .obtenerProductosVentaTraer(tvVentasDetalle.nId)
      .subscribe((data) => {
        this.listaVentasProductosTraer = data;
        if( this.listaVentasProductosTraer.length>0){
          this.botonProductosTraer=true;
        }
        else{
          this.botonProductosTraer=false;

        }


        //  console.log( this.listaVentasProductosTraer );
      });
      


      



  }


  mostrarProductosTraer(){
    this.mostrarDialogTraer=true;
  }

  generarVentaPdf(tvVentasDetalle: TvVentasDetalle) {
    this.ventasService
      .generarVentaAlmacenPdf(tvVentasDetalle.nId)
      .subscribe((resp) => {
        const file = new Blob([resp], { type: "application/pdf" });
        //console.log("file: " + file.size);
        if (file != null && file.size > 0) {
          const fileURL = window.URL.createObjectURL(file);
          const anchor = document.createElement("a");
          anchor.download = "venta_" + tvVentasDetalle.nId + ".pdf";
          anchor.href = fileURL;
          anchor.click();
          this.messageService.add({
            severity: "success",
            summary: "Se realizó con éxito",
            detail: "Comprobante de venta Generado",
            life: 3000,
          });
          //una vez generado el reporte limpia el formulario para una nueva venta o cotización
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Error al generar el comprobante de venta",
            life: 3000,
          });
        }
      });
  }

  hideDialogAlter() {
    this.mostrarProductos = false;
  }
  cerrarTraer(){
    this.mostrarDialogTraer = false;
  }


  entregaProducto(prod: VentaProductoDto) {
    //console.log(prod);

    prod.nEstatusEntregaAlmacen = prod.nEstatusEntregaAlmacen? 1: 0;

    this.ventasService.guardaVentaProductoEntregaId(prod).subscribe(data => {
      this.messageService.add({
        severity: "success",
        summary: "Se realizó con éxito",
        detail: "Se guardo la entrega del producto",
        life: 3000,
      });

      this.consultaVentas();
    });
  }
}
