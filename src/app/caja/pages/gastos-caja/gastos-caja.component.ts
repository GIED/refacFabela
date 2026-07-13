import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TwCaja } from 'src/app/productos/model/TwCaja';
import { TwGasto } from 'src/app/productos/model/TwGasto';
import { CatalogoService } from 'src/app/shared/service/catalogo.service';
import { TokenService } from 'src/app/shared/service/token.service';

@Component({
  selector: 'app-gastos-caja',
  templateUrl: './gastos-caja.component.html',
  styleUrls: ['./gastos-caja.component.scss']
})
export class GastosCajaComponent implements OnInit {

  listaGastosCaja:TwGasto[];
  cajaActiva:TwCaja;
  mostrarFormGasto:boolean;
  monto:number;
  categoria:number;
  descripcion:string;
  gasto:TwGasto;
  nGastosDia:number;
  

  constructor(    
    private messageService: MessageService,   
    private tokenService: TokenService,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder,
    private catalogo: CatalogoService
  ) { 
    this.mostrarFormGasto=false;
    this.listaGastosCaja=[];
    this.cajaActiva={};
    this.nGastosDia=0;
  }

  ngOnInit(): void {
    this.obtenerGastosCaja();
  }

  obtenerGastosCaja(){
    this.nGastosDia = 0;
    this.listaGastosCaja = [];

    this.catalogo.obtenerCajaActiva().subscribe(data=>{
      this.cajaActiva=data || {};
      if (!this.cajaActiva?.nId) {
        this.messageService.add({severity: 'warn', summary: 'Caja no disponible', detail: 'No hay una caja activa para consultar gastos.', life: 4000});
        return;
      }

      this.catalogo.obtenerGastosCaja(this.cajaActiva.nId).subscribe(data=>{
          this.listaGastosCaja=data || [];

        for (let index = 0; index <  this.listaGastosCaja.length; index++) {
          this.nGastosDia=this.nGastosDia + this.listaGastosCaja[index].nMonto;
        }

      }, () => {
        this.listaGastosCaja = [];
        this.nGastosDia = 0;
        this.messageService.add({severity: 'error', summary: 'Error', detail: 'No fue posible consultar los gastos de la caja activa.', life: 4000});
      });
  }, () => {
    this.cajaActiva = {};
    this.listaGastosCaja = [];
    this.nGastosDia = 0;
    this.messageService.add({severity: 'error', summary: 'Error', detail: 'No fue posible consultar la caja activa.', life: 4000});
  });
  }

  abrirFormulularioGasto(){
    this.mostrarFormGasto=true;
  }

  hideDialog(event: boolean) {
    this.obtenerGastosCaja();
    this.mostrarFormGasto = false;   
  }

  borrarGasto(twGasto:TwGasto){
    this.catalogo.borrarGasto(twGasto).subscribe(data=>{
      this.obtenerGastosCaja();
      this.messageService.add({severity: 'error', summary: 'Registro borrado', detail: 'Se borro el abono', life: 3000});
    })
  }

  
}
