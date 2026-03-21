import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { UsuarioService } from '../../service/usuario.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuarios } from '../../interfaces/usuarios';
import { NuevoUsuario } from '../../model/nuevo-usuario';
import { ClienteService } from '../../service/cliente.service';
import { TcCliente } from '../../model/TcCliente';
import { TcTipoRevendedor } from '../../model/TcTipoRevendedor';

interface Roles {
    name: string;
    code: string;
  }

@Component({
    selector: 'app-usuario',
    templateUrl: './usuario.component.html',
    styleUrls: ['../../../tabledemo.scss'],
    styles: [`
  :host ::ng-deep .p-dialog .product-image {
      width: 150px;
      margin: 0 auto 2rem auto;
      display: block;
  }

  :host ::ng-deep .p-dialog .p-dialog-header {
      border-bottom: 2px solid var(--primary-color);
      padding: 1.25rem 1.5rem;
  }

  :host ::ng-deep .p-dialog .p-dialog-content {
      padding: 1.5rem;
  }

  :host ::ng-deep .p-dialog .p-dialog-footer {
      border-top: 1px solid #dee2e6;
      padding: 1rem 1.5rem;
  }

  .section-card {
      background: var(--surface-50, #fafafa);
      border: 1px solid var(--surface-200, #e9ecef);
      border-radius: 8px;
      padding: 1.25rem;
      margin-bottom: 1.25rem;
  }

  .section-title {
      font-size: 0.85rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--primary-color);
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
  }

  .section-title i {
      font-size: 1rem;
  }

  :host ::ng-deep .usuario-dialog .p-inputtext {
      border-radius: 6px;
      transition: border-color 0.2s, box-shadow 0.2s;
  }

  :host ::ng-deep .usuario-dialog .p-inputtext:focus {
      box-shadow: 0 0 0 2px rgba(var(--primary-color-rgb, 59,130,246), 0.15);
  }

  :host ::ng-deep .usuario-dialog .p-dropdown {
      border-radius: 6px;
  }

  :host ::ng-deep .usuario-dialog .p-listbox {
      border-radius: 6px;
  }

  :host ::ng-deep .usuario-dialog .p-listbox .p-listbox-item {
      border-radius: 4px;
      margin: 2px 4px;
  }

  :host ::ng-deep .usuario-dialog .p-autocomplete .p-inputtext {
      border-radius: 6px;
  }

  .campo-label {
      font-weight: 600;
      font-size: 0.875rem;
      color: var(--text-color);
      margin-bottom: 0.5rem;
      display: flex;
      align-items: center;
      gap: 0.35rem;
  }

  .campo-label i {
      color: var(--primary-color);
      font-size: 0.9rem;
  }

  .revendedor-panel {
      animation: fadeIn 0.3s ease-in-out;
  }

  @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-8px); }
      to { opacity: 1; transform: translateY(0); }
  }

  .info-chip {
      background: var(--primary-color);
      color: #fff;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.8rem;
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      margin-top: 0.5rem;
  }

  .info-chip i {
      font-size: 0.75rem;
  }

  @media screen and (max-width: 960px) {
      :host ::ng-deep .p-datatable.p-datatable-customers .p-datatable-tbody > tr > td:last-child {
          text-align: center;
      }

      :host ::ng-deep .p-datatable.p-datatable-customers .p-datatable-tbody > tr > td:nth-child(6) {
          display: flex;
      }
  }

  .usuarios-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 1rem;
      margin-bottom: 1.25rem;
  }

  .header-left {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
  }

  .header-right {
      display: flex;
      align-items: center;
  }

  .avatar-circle {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: var(--primary-color);
      color: #fff;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.85rem;
      flex-shrink: 0;
  }

  .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
      padding: 0.25rem 0.65rem;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 600;
  }

  .status-active {
      background: #d4edda;
      color: #155724;
  }

  .status-inactive {
      background: #f8d7da;
      color: #721c24;
  }

  :host ::ng-deep .p-datatable .p-datatable-thead > tr > th {
      background: var(--surface-50, #f8f9fa);
      font-weight: 700;
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      color: var(--text-color-secondary);
      border-bottom: 2px solid var(--primary-color);
  }

  :host ::ng-deep .p-datatable-striped .p-datatable-tbody > tr:nth-child(even) {
      background: var(--surface-50, #f8f9fa);
  }

  :host ::ng-deep .p-datatable .p-datatable-tbody > tr:hover {
      background: rgba(var(--primary-color-rgb, 59,130,246), 0.04) !important;
  }

  :host ::ng-deep .p-paginator {
      border: none;
      padding: 1rem 0 0;
  }

  :host ::ng-deep .p-paginator .p-paginator-pages .p-paginator-page.p-highlight {
      border-radius: 6px;
  }

  :host ::ng-deep .p-datatable .p-datatable-header {
      background: transparent;
      border: none;
      padding: 0.75rem 0;
  }

`],
})
export class UsuarioComponent implements OnInit {

    listaUsuarios: NuevoUsuario[];
    formulario: FormGroup;
    usuarioDialog: boolean;
    muestraInput:boolean;
    muestraInputCliente:boolean;
    nuevoUsuario: NuevoUsuario;
    roles: Roles[];
    guarda:boolean=false;
    actualizaUsiario:Usuarios;
    clientesFiltrados: TcCliente[] = [];
    clienteSeleccionado: TcCliente;
    tiposRevendedor: TcTipoRevendedor[] = [];
    mostrarPassword: boolean = false;

    constructor(private usuarioService: UsuarioService, private fb: FormBuilder, private messageService: MessageService,
        private confirmationService: ConfirmationService, private clienteService: ClienteService) {
        this.crearFormulario()
        this.roles = [
            { name: "Administrador", code: "admin" },
            { name: "Ventas", code: "ventas" },
            { name: "Almacen", code: "almacen" },
            { name: "Caja", code: "caja" },
            { name: "distribuidor", code:"distribuidor"},
            { name: "Revendedor", code: "revendedor" }
          ];
        this.listaUsuarios=[];
        this.muestraInput=false;
        this.muestraInputCliente=false;
    }

    ngOnInit() {
        this.nuevoUsuario=null;
        this.obtenerUsuarios();
        this.cargarTiposRevendedor();
    }

    cargarTiposRevendedor() {
        this.usuarioService.getTipoRevendedor().subscribe(tipos => {
            this.tiposRevendedor = tipos || [];
        });
    }

    obtenerUsuarios() {
        this.usuarioService.getUsuarios().subscribe(usuarios => {
            this.listaUsuarios = usuarios.map(usuario =>
                new NuevoUsuario(usuario.nId, usuario.sClaveUser, usuario.sUsuario, usuario.sPassword, usuario.sNombreUsuario, usuario.nEstatus, usuario.rfcDistribuidor)
            );
        });
    }


    get validaNomUsu() {
        return this.formulario.get('sNombreUsuario').invalid && this.formulario.get('sNombreUsuario').touched;
    }
    get validaUsuario() {
        return this.formulario.get('sUsuario').invalid && this.formulario.get('sUsuario').touched;
    }
    get validaPassword() {
        return this.formulario.get('sPassword').invalid && this.formulario.get('sPassword').touched;
    }
    get validaRol() {
        return this.formulario.get('roles').invalid && this.formulario.get('roles').touched;
    }
    get validaRfcDistribuidor() {
        return this.formulario.get('rfcDistribuidor').invalid && this.formulario.get('rfcDistribuidor').touched;
    }

    // Crear formulario con sus validaciones de clientes
    crearFormulario() {
        this.formulario = this.fb.group({
            nId: ['', []],
            nEstatus: ['', []],
            sClaveUser: ['', []],
            sNombreUsuario: ['', [Validators.required]],
            sUsuario: ['', [Validators.required]],
            sPassword: ['', []],
            roles: ['', [Validators.required]],
            rfcDistribuidor:['',[Validators.required]],
            nIdCliente: [null, []],
            nTipoRevendedor: [null, []]
        })
    }

    openNew() {
        this.guarda=true;
        this.limpiarFormulario();
        this.fUsuario.sPassword.setValidators([Validators.required]);
        this.fUsuario.sPassword.updateValueAndValidity();
        this.usuarioDialog = true;
    }


    editUsuario(usuario: NuevoUsuario) {
        this.guarda = false;
        this.limpiarFormulario();
        this.usuarioDialog = true;

        // Fetch full user data from backend (includes roles, nIdCliente, nTipoRevendedor)
        this.usuarioService.getUsuariosId(usuario.nId).subscribe(usr => {
            this.fUsuario.nId.setValue(usr.nId);
            this.fUsuario.nEstatus.setValue(usr.nEstatus);
            this.fUsuario.sClaveUser.setValue(usr.sClaveUser);
            this.fUsuario.sNombreUsuario.setValue(usr.sNombreUsuario);
            this.fUsuario.sUsuario.setValue(usr.sUsuario);
            // Password intentionally left empty - user must enter a new one
            this.fUsuario.sPassword.setValue('');

            // Map backend roles (TcRol objects) to frontend codes
            if (usr.roles && usr.roles.length > 0) {
                const rolMap = {
                    'ROLE_ADMIN': 'admin',
                    'ROLE_VENTA': 'ventas',
                    'ROLE_ALMACEN': 'almacen',
                    'ROLE_CAJA': 'caja',
                    'ROLE_DISTRIBUIDOR': 'distribuidor',
                    'ROLE_REVENDEDOR': 'revendedor'
                };
                const mappedRoles = usr.roles.map(r => rolMap[r.sRol]).filter(r => !!r);
                this.fUsuario.roles.setValue(mappedRoles);
            }

            // Set rfcDistribuidor
            this.fUsuario.rfcDistribuidor.setValue('no aplica');

            // Toggle distribuidor/revendedor panels based on roles
            this.muestraInput = false;
            this.muestraInputCliente = false;
            const rolesValue = this.fUsuario.roles.value || [];
            for (const rol of rolesValue) {
                if (rol === 'distribuidor') {
                    this.muestraInput = true;
                    this.fUsuario.rfcDistribuidor.setValue('');
                }
                if (rol === 'revendedor') {
                    this.muestraInputCliente = true;
                }
            }

            // Load nIdCliente and nTipoRevendedor
            if (usr.nIdCliente) {
                this.fUsuario.nIdCliente.setValue(usr.nIdCliente);
                // Fetch client details to show in autocomplete
                this.clienteService.consultaClienteId(usr.nIdCliente).subscribe(cliente => {
                    if (cliente) {
                        this.clienteSeleccionado = cliente;
                    }
                });
            }
            if (usr.nTipoRevendedor) {
                this.fUsuario.nTipoRevendedor.setValue(usr.nTipoRevendedor);
            }
        });
    }

    limpiarFormulario() {
        this.fUsuario.nId.setValue("");
        this.fUsuario.nEstatus.setValue("");
        this.fUsuario.sClaveUser.setValue("");
        this.fUsuario.sNombreUsuario.setValue("");
        this.fUsuario.sUsuario.setValue("");
        this.fUsuario.sPassword.setValue("");
        this.fUsuario.sPassword.clearValidators();
        this.fUsuario.sPassword.updateValueAndValidity();
        this.fUsuario.roles.setValue("");
        this.fUsuario.rfcDistribuidor.setValue('no aplica');
        this.fUsuario.nIdCliente.setValue(null);
        this.fUsuario.nTipoRevendedor.setValue(null);
        this.clienteSeleccionado = null;
        this.clientesFiltrados = [];
        this.muestraInput = false;
        this.muestraInputCliente = false;
        this.mostrarPassword = false;
    }

    deleteUsuario(usuario: Usuarios) {


        this.confirmationService.confirm({
            message: 'Estas seguro que deseas desactivar al usuario ' + usuario.sNombreUsuario + '?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                usuario.nEstatus = 0;
                this.usuarioService.guardarUsuario(usuario).subscribe(usuarioDesactivado => {
                    this.listaUsuarios=[];
                  this.obtenerUsuarios();
                    this.messageService.add({ severity: 'success', summary: 'Se realizó con éxito', detail: 'Usuario desactivado', life: 3000 });
                  
                })
            }
            
        });
    }

    actualizarUsuario() {
        this.nuevoUsuario = this.formulario.value;
        // If password is empty, don't send it (backend won't update it)
        if (!this.nuevoUsuario.sPassword || this.nuevoUsuario.sPassword.trim() === '') {
            this.messageService.add({ severity: 'warn', summary: 'Atención', detail: 'Debes ingresar una nueva contraseña para actualizar', life: 5000 });
            return;
        }
        this.usuarioService.guardarUsuario(this.nuevoUsuario).subscribe(usuarioActualizado => {
            this.listaUsuarios = [];
            this.obtenerUsuarios();
            this.messageService.add({ severity: 'success', summary: 'Se realizó con éxito', detail: 'Usuario actualizado', life: 3000 });
            this.usuarioDialog = false;
        });
    }

    hideDialog() {
        this.usuarioDialog = false;
        this.limpiarFormulario();
    }

    guardarUsuario() {
        if (this.formulario.invalid) {
            return Object.values(this.formulario.controls).forEach(control => {
                if (control instanceof FormGroup) {
                    // tslint:disable-next-line: no-shadowed-variable
                    Object.values(control.controls).forEach(control => control.markAsTouched());
                } else {
                    control.markAsTouched();
                }
            });
        } else {
            this.nuevoUsuario = this.formulario.value; 
            //console.log(this.nuevoUsuario);          
                this.nuevoUsuario.sClaveUser = this.createId();
                this.nuevoUsuario.nEstatus = 1;
                this.usuarioService.nuevo(this.nuevoUsuario).subscribe(usuarioNuevo => {
                    this.listaUsuarios.push(usuarioNuevo);
                    this.messageService.add({ severity: 'success', summary: 'Se realizó con éxito', detail: 'Usuario guardado', life: 10000 });
                })

                this.listaUsuarios=[];
                this.obtenerUsuarios();      
           
            this.limpiarFormulario();
            this.usuarioDialog = false;
            
        }

    }

    verificaDistribuidor(){

        let valor =this.fUsuario.roles.value;

        if (valor.length === 0) {
            this.muestraInput=false;
            this.muestraInputCliente=false;
            this.fUsuario.rfcDistribuidor.setValue('no aplica');
            this.fUsuario.nIdCliente.setValue(null);
            this.fUsuario.nTipoRevendedor.setValue(null);
        }else{
            this.muestraInput=false;
            this.muestraInputCliente=false;
            this.fUsuario.rfcDistribuidor.setValue('no aplica');
            this.fUsuario.nIdCliente.setValue(null);
            this.fUsuario.nTipoRevendedor.setValue(null);
            for (const valor of this.fUsuario.roles.value) {
                ////console.log(valor);
                    if (valor === 'distribuidor') {
                        this.muestraInput=true;
                        this.fUsuario.rfcDistribuidor.setValue('');
                    }
                    if (valor === 'revendedor') {
                        this.muestraInputCliente=true;
                    }
            }
        }


        

        
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.listaUsuarios.length; i++) {
            if (this.listaUsuarios[i].nId.toString() === id) {
                index = i;
                break;
            }
        }
        return index;
    }

    createId(): string {
        let id = '';
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }
    buscarClientes(event: any) {
        const query = event.query;
        if (query && query.length >= 3) {
            this.clienteService.obtenerClientesLike(query).subscribe(
                clientes => {
                    this.clientesFiltrados = clientes || [];
                },
                () => {
                    this.clientesFiltrados = [];
                }
            );
        } else {
            this.clientesFiltrados = [];
        }
    }

    seleccionarCliente(event: any) {
        this.clienteSeleccionado = event;
        this.fUsuario.nIdCliente.setValue(event.nId);
    }

    togglePassword() {
        this.mostrarPassword = !this.mostrarPassword;
    }

    get fUsuario() {
        return this.formulario.controls;
    }
}


