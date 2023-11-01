import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { VentasService } from '../../../shared/service/ventas.service';
import { TwMaquinaCliente } from '../../../productos/model/TwMaquinaCliente';

@Component({
  selector: 'app-maquina-cliente',
  templateUrl: './maquina-cliente.component.html',
  styleUrls: ['./maquina-cliente.component.scss']
})
export class MaquinaClienteComponent implements OnInit {


  @Input() nICliente:number;

  listaMaquinaCliente:TwMaquinaCliente[];
  maquinaCliente:TwMaquinaCliente; 
    
  mostrarFormularioMaquinasClienteEdita=false;

  constructor(private messageService: MessageService, private ventasService: VentasService ) { }

  ngOnInit() {
    this.obtenerMaquinasCliente();
  }

  obtenerMaquinasCliente(){
    this.ventasService.obtenerMaquinasCliente(this.nICliente).subscribe(data=>{

      this.listaMaquinaCliente=data;

      //console.log(this.listaMaquinaCliente);


    });
  }

  abrirFormularioMaquinaClienteEdita(twMaquinaCliente:TwMaquinaCliente){

    this.maquinaCliente=twMaquinaCliente; 
    
    this.mostrarFormularioMaquinasClienteEdita=true;
  }

  cerrarVentanas(valor:boolean){
  
    this.mostrarFormularioMaquinasClienteEdita=valor;
   



  }

}
