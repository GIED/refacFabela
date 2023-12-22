import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TokenService } from 'src/app/shared/service/token.service';
import { ClienteService } from '../../service/cliente.service';
import { CatalogoService } from '../../../shared/service/catalogo.service';
import { TwCaja } from '../../../productos/model/TwCaja';
import { VentasService } from 'src/app/shared/service/ventas.service';
import { UsuarioService } from '../../service/usuario.service';
import { TvReporteDetalleVenta } from 'src/app/productos/model/TvReporteDetalleVenta';

@Component({
  selector: 'app-admin-caja',
  templateUrl: './admin-caja.component.html',
  styleUrls: ['./admin-caja.component.scss']
})
export class AdminCajaComponent implements OnInit {

  listaCajas:TwCaja[];
  mostrarRegistroCaja: boolean=false;
  formulario: FormGroup;
  cajaNueva:TwCaja;
  mostrarCaja:boolean;
  listaVentasReporte:TvReporteDetalleVenta[];
  cols:any;


  constructor(private messageService: MessageService,
    private confirmationService: ConfirmationService, private clienteService: ClienteService, private fb: FormBuilder,
    private tokenService: TokenService, private catalogoService: CatalogoService, private ventasService: VentasService) { 

      this.listaCajas= [];
      this.listaVentasReporte=[];


     
      this.cols = [
        { field: 'nIdVenta', header: 'nIdVenta' },
        { field: 'sRfc', header: 'sRfc' },
        { field: 'sRazonSocial', header: 'sRazonSocial' },
        { field: 'sEstatusVenta', header: 'sEstatusVenta' },
        { field: 'sTipoVenta', header: 'sTipoVenta' },
        { field: 'sTipoPago', header: 'sTipoPago' },
        { field: 'dInicioCredito', header: 'dInicioCredito' },   
        { field: 'dTerminoCredito', header: 'dTerminoCredito' },
        { field: 'sNombreUsuario', header: 'sNombreUsuario' },
        { field: 'sFormaPago', header: 'sFormaPago' },
        { field: 'nDescuento', header: 'nDescuento' },
        { field: 'nTotalVenta', header: 'nTotalVenta' },   
        { field: 'nTotalPagoCajaNota', header: 'nTotalPagoCajaNota' },
        { field: 'nSaldoFinalVenta', header: 'nSaldoFinalVenta' },
        { field: 'sEstatusEntrega', header: 'sEstatusEntrega' }    ]


    

    }

  ngOnInit(): void {
    this.crearFormulario();


   this.mostrarCajas();


    


  }

  mostrarCajas(){

    this.catalogoService.obtenerCajas().subscribe(data=>{

      this.listaCajas=data;

    })
    

  }


  consultarDetalleVentas(nId:number){

    this.mostrarCaja=true;

    this.ventasService.obtenerVentaCaja(nId).subscribe(data=>{

      this.listaVentasReporte=data;

    })

   




  }

  hideDialogAlter(){
    this.mostrarCaja=false;

  }

  crearFormulario() {
    this.formulario = this.fb.group({
      n_saldoInicial: ['', [Validators.required]],
     
    })
  }

  generarBalance(caja:TwCaja){

    this.ventasService.generarBalanceCajaPdf(caja.nId).subscribe(resp => {


      const file = new Blob([resp], { type: 'application/pdf' });
      //console.log('file: ' + file.size);
      if (file != null && file.size > 0) {
        const fileURL = window.URL.createObjectURL(file);
        const anchor = document.createElement('a');
        anchor.download = 'reporte_caja_' + '1' + '.pdf';
        anchor.href = fileURL;
        anchor.click();
        this.messageService.add({ severity: 'success', summary: 'Se realizó con éxito', detail: 'Balance de caja Generado', life: 3000 });
        //una vez generado el reporte limpia el formulario para una nueva venta o cotización 

      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al generar el balance de la caja', life: 3000 });
      }

    });

  }

  abrirFormularioCaja(){
    
    this.mostrarRegistroCaja=true;


  }



  get validan_saldoInicial() {
    return this.formulario.get('n_saldoInicial').invalid;
  }
 

  get fclientes() {
    return this.formulario.controls
  }

  hideDialog(){
    this.mostrarRegistroCaja=false;

  }

  nuevaCaja(){   


    this.catalogoService.abrirCajaNueva(this.formulario.get('n_saldoInicial').value,this.tokenService.getIdUser()).subscribe(data=>{

        this.cajaNueva=data;
        this.mostrarRegistroCaja=false;
        this.mostrarCajas();


    })



  }


}
