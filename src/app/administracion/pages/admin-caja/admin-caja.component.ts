import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TokenService } from 'src/app/shared/service/token.service';
import { ClienteService } from '../../service/cliente.service';
import { CatalogoService } from '../../../shared/service/catalogo.service';
import { TwCaja } from '../../../productos/model/TwCaja';
import { VentasService } from 'src/app/shared/service/ventas.service';
import { UsuarioService } from '../../service/usuario.service';

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

  constructor(private messageService: MessageService,
    private confirmationService: ConfirmationService, private clienteService: ClienteService, private fb: FormBuilder,
    private tokenService: TokenService, private catalogoService: CatalogoService, private ventasService: VentasService) { 

      this.listaCajas= [];

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

  crearFormulario() {
    this.formulario = this.fb.group({
      n_saldoInicial: ['', [Validators.required]],
     
    })
  }

  generarBalance(caja:TwCaja){

    this.ventasService.generarBalanceCajaPdf(caja.nId).subscribe(resp => {


      const file = new Blob([resp], { type: 'application/pdf' });
      console.log('file: ' + file.size);
      if (file != null && file.size > 0) {
        const fileURL = window.URL.createObjectURL(file);
        const anchor = document.createElement('a');
        anchor.download = 'reporte_caja_' + '1' + '.pdf';
        anchor.href = fileURL;
        anchor.click();
        this.messageService.add({ severity: 'success', summary: 'Correcto', detail: 'Balance de caja Generado', life: 3000 });
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
