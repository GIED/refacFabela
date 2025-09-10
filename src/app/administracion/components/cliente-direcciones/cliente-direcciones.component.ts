import { Component, OnInit } from '@angular/core';
import { ClienteDireccionEnvio } from '../../model/ClienteDireccionEnvio';
import { ClienteDireccionService } from 'src/app/shared/service/cliente-direccion.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ModelContainer } from 'src/app/shared/utils/model-container';
import { ObjectUtils } from 'src/app/shared/utils/object-ultis';

@Component({
  selector: 'app-cliente-direcciones',
  templateUrl: './cliente-direcciones.component.html',
  styleUrls: ['./cliente-direcciones.component.scss']
})
export class ClienteDireccionesComponent implements OnInit {

  listaDirecciones: ClienteDireccionEnvio[] = [];
  modelContainer: ModelContainer;
  clienteDireccionEnvio: ClienteDireccionEnvio;

  constructor(private _clienteDireccionService:ClienteDireccionService, public ref: DynamicDialogRef, public config: DynamicDialogConfig,) { 
    this.modelContainer = this.config.data;
    this.clienteDireccionEnvio = ObjectUtils.isEmpty(this.modelContainer.modelData) ? new ClienteDireccionEnvio() : this.modelContainer.modelData as ClienteDireccionEnvio;
  }

  ngOnInit(): void {
    this.obtenerDirecciones();
  }
  
  obtenerDirecciones(): void {
    this._clienteDireccionService.obtener(this.clienteDireccionEnvio.nIdCliente!).subscribe({
      next: (direcciones) => {
        this.listaDirecciones = direcciones;
        console.log('Direcciones obtenidas:', this.listaDirecciones);
      },
      error: (err) => {
        console.error('Error al obtener las direcciones:', err);
      }
    });   
  }

}
