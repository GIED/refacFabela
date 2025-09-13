import { Component, OnInit } from '@angular/core';
import { ClienteDireccionEnvio } from '../../model/ClienteDireccionEnvio';
import { ClienteDireccionService } from 'src/app/shared/service/cliente-direccion.service';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ModelContainer } from 'src/app/shared/utils/model-container';
import { ObjectUtils } from 'src/app/shared/utils/object-ultis';
import { ModeActionOnModel } from 'src/app/shared/utils/model-action-on-model';
import { FormDireccionClienteComponent } from '../form-direccion-cliente/form-direccion-cliente.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-cliente-direcciones',
  templateUrl: './cliente-direcciones.component.html',
  styleUrls: ['./cliente-direcciones.component.scss']
})
export class ClienteDireccionesComponent implements OnInit {

  listaDirecciones: ClienteDireccionEnvio[] = [];
  modelContainer: ModelContainer;
  clienteDireccionEnvio: ClienteDireccionEnvio;
  savingDefault = false;

  constructor(private _clienteDireccionService:ClienteDireccionService, public ref: DynamicDialogRef, public config: DynamicDialogConfig,
    private _dialogService: DialogService, private confirm: ConfirmationService,
    private msg: MessageService) { 
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

   onTogglePredeterminada(ev: any /* CheckboxChangeEvent */, dir: ClienteDireccionEnvio): void {
    if (!this.clienteDireccionEnvio?.nIdCliente) return;

    const dirId = (dir as any).nId ?? (dir as any).id;

    // Si se intentó desmarcar la que era predeterminada, no lo permitimos: revertimos
    if (ev?.checked === false) {
      // No permitir “ninguna predeterminada”
      dir.bPredeterminada = true;
      return;
    }

    // Si se marcó esta, apagamos las demás (optimista) y llamamos al backend
    const snapshot = this.listaDirecciones.map(d => ({
      ref: d,
      b: d.bPredeterminada
    }));

    this.listaDirecciones.forEach(d => {
      const id = (d as any).nId ?? (d as any).id;
      d.bPredeterminada = id === dirId;
    });

    this.savingDefault = true;
    this._clienteDireccionService
      .predeterminada(this.clienteDireccionEnvio.nIdCliente!, dirId)
      .subscribe({
        next: () => {
          // OK, ya quedó. (Si quieres reordenar, puedes llamar obtenerDirecciones())
        },
        error: (err) => {
          console.error('No se pudo actualizar predeterminada:', err);
          // Revertimos al estado anterior
          snapshot.forEach(s => (s.ref.bPredeterminada = s.b));
        }
      })
      .add(() => (this.savingDefault = false));
  }

  openDialogAddDirecciones() {
      this.clienteDireccionEnvio.nIdCliente = this.clienteDireccionEnvio.nIdCliente;
      
      const data = new ModelContainer(ModeActionOnModel.CREATING, this.clienteDireccionEnvio);
  
      this.ref = this._dialogService.open(FormDireccionClienteComponent, {
        data: data,
        header: "Direcciones de envío",
        width: "70%",
        height: "60%",
      });

      this.ref.onClose.subscribe((result) => {
        if (result) {
          this.obtenerDirecciones(); // Refrescar la lista después de agregar o editar
        }      
    });
  }

  openDialogEditDirecciones(cliente: ClienteDireccionEnvio) {
      this.clienteDireccionEnvio = cliente;
      
      const data = new ModelContainer(ModeActionOnModel.EDITING, this.clienteDireccionEnvio);
  
      this.ref = this._dialogService.open(FormDireccionClienteComponent, {
        data: data,
        header: "Direcciones de envío",
        width: "70%",
        height: "60%",
      });

      this.ref.onClose.subscribe((result) => {
        if (result) {
          this.obtenerDirecciones(); // Refrescar la lista después de agregar o editar
        }      
    });
  }

  private getDirId(d: any): number {
    return d?.nId ?? d?.id;
  }

  eliminar(direccion: ClienteDireccionEnvio): void {
    const dirId = this.getDirId(direccion);
    const clienteId = this.clienteDireccionEnvio?.nIdCliente;

    if (!dirId) {
      this.msg.add({ severity: 'warn', summary: 'Sin ID', detail: 'Dirección inválida.', life: 6000 });
      return;
    }
    if (!clienteId) {
      this.msg.add({ severity: 'warn', summary: 'Falta cliente', detail: 'No hay cliente asociado.', life: 6000 });
      return;
    }
    if (this.listaDirecciones.length <= 1) {
      this.msg.add({
        severity: 'info',
        summary: 'No permitido',
        detail: 'Debe existir al menos una dirección. Agrega otra antes de eliminar.',
        life: 7000
      });
      return;
    }

    this.confirm.confirm({
      key: 'eliminarDireccion',
      header: 'Confirmar eliminación',
      message: '¿Deseas eliminar esta dirección de envío?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.savingDefault = true;
        this._clienteDireccionService
          .eliminar(dirId)
          .pipe(finalize(() => (this.savingDefault = false)))
          .subscribe({
            next: () => {
              const eraPredeterminada = !!direccion.bPredeterminada;
              // quita de la lista
              this.listaDirecciones = this.listaDirecciones.filter(x => this.getDirId(x) !== dirId);

              if (eraPredeterminada && this.listaDirecciones.length) {
                // 👉 si borraste la predeterminada, define una nueva (la primera, o la que gustes)
                const nueva = this.listaDirecciones[0];
                const nuevoId = this.getDirId(nueva);

                // UI optimista
                this.listaDirecciones.forEach(x => (x.bPredeterminada = this.getDirId(x) === nuevoId));

                // sincroniza con backend (opcional pero recomendado para tu regla “siempre 1 predeterminada”)
                this._clienteDireccionService.predeterminada(clienteId, nuevoId).subscribe({
                  next: () => {
                    this.msg.add({
                      severity: 'success',
                      summary: 'Eliminada',
                      detail: 'Dirección eliminada y predeterminada actualizada.',
                      life: 6000
                    });
                  },
                  error: () => {
                    // si falla, al menos informa; podrías volver a cargar desde backend para asegurar estado
                    this.msg.add({
                      severity: 'warn',
                      summary: 'Predeterminada no actualizada',
                      detail: 'Se eliminó la dirección, pero no se pudo actualizar la predeterminada.',
                      life: 7000
                    });
                  }
                });
              } else {
                this.msg.add({
                  severity: 'success',
                  summary: 'Eliminada',
                  detail: 'Dirección eliminada correctamente.',
                  life: 6000
                });
              }
            },
            error: (err) => {
              console.error(err);
              this.msg.add({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudo eliminar la dirección.',
                life: 7000
              });
            }
          });
      }
    });
  }

}
