import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { UsuarioService } from '../../service/usuario.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuarios } from '../../interfaces/usuarios';
import { NuevoUsuario } from '../../model/nuevo-usuario';

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

  @media screen and (max-width: 960px) {
      :host ::ng-deep .p-datatable.p-datatable-customers .p-datatable-tbody > tr > td:last-child {
          text-align: center;
      }

      :host ::ng-deep .p-datatable.p-datatable-customers .p-datatable-tbody > tr > td:nth-child(6) {
          display: flex;
      }
  }

`],
})
export class UsuarioComponent implements OnInit {

    listaUsuarios: NuevoUsuario[];
    formulario: FormGroup;
    usuarioDialog: boolean;
    muestraInput:boolean;
    nuevoUsuario: NuevoUsuario;
    roles: Roles[];

    constructor(private usuarioService: UsuarioService, private fb: FormBuilder, private messageService: MessageService,
        private confirmationService: ConfirmationService) {
        this.crearFormulario()
        this.roles = [
            { name: "Administrador", code: "admin" },
            { name: "Ventas", code: "ventas" },
            { name: "Almacen", code: "almacen" },
            { name: "Caja", code: "caja" },
            { name: "distribuidor", code:"distribuidor"}
          ];
        this.listaUsuarios=[];
        this.muestraInput=false;
    }

    ngOnInit() {
        this.obtenerUsuarios();
    }

    obtenerUsuarios() {
        this.usuarioService.getUsuarios().subscribe(usuarios => {

            console.log(usuarios);
            for (const usuario of usuarios) {
                this.nuevoUsuario = new NuevoUsuario(usuario.nId, usuario.sClaveUser,usuario.sUsuario,usuario.sPassword, usuario.sNombreUsuario, usuario.nEstatus, usuario.rfcDistribuidor);
                this.listaUsuarios.push(this.nuevoUsuario);    
            }

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
            sPassword: ['', [Validators.required]],
            roles: ['', [Validators.required]],
            rfcDistribuidor:['',[Validators.required]]
        })
    }

    openNew() {
        this.limpiarFormulario();
        this.usuarioDialog = true;
    }


    editUsuario(usuario: Usuarios) {
        this.usuarioDialog = true;
        this.fUsuario.nId.setValue(usuario.nId);
        this.fUsuario.nEstatus.setValue(usuario.nEstatus);
        this.fUsuario.sClaveUser.setValue(usuario.sClaveuser);
        this.fUsuario.sNombreUsuario.setValue(usuario.sNombreUsuario);
        this.fUsuario.sUsuario.setValue(usuario.sUsuario);
        this.fUsuario.sPassword.setValue(usuario.sPassword);

    }

    limpiarFormulario() {
        this.fUsuario.nId.setValue("");
        this.fUsuario.nEstatus.setValue("");
        this.fUsuario.sClaveUser.setValue("");
        this.fUsuario.sNombreUsuario.setValue("");
        this.fUsuario.sUsuario.setValue("");
        this.fUsuario.sPassword.setValue("");
        this.fUsuario.roles.setValue("");
    }

    deleteUsuario(usuario: Usuarios) {
        this.confirmationService.confirm({
            message: 'Estas seguro que deseas desactivar al usuario ' + usuario.sNombreUsuario + '?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                usuario.nEstatus = 0;
                /*this.usuarioService.guardaUsuario(usuario).subscribe(usuarioDesactivado => {
                    this.listaUsuarios[this.findIndexById(usuarioDesactivado.nId.toString())] = usuarioDesactivado;
                    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'usuario desactivado', life: 3000 });
                })*/
            }
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
            console.log(this.nuevoUsuario);          
                this.nuevoUsuario.sClaveUser = this.createId();
                this.nuevoUsuario.nEstatus = 1;
                this.usuarioService.nuevo(this.nuevoUsuario).subscribe(usuarioNuevo => {
                    this.listaUsuarios.push(usuarioNuevo);
                    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'usuario guardado', life: 10000 });
                })
            
            this.listaUsuarios = [...this.listaUsuarios];
            this.limpiarFormulario();
            this.usuarioDialog = false;
            
        }

    }

    verificaDistribuidor(){

        let valor =this.fUsuario.roles.value;

        if (valor.length === 0) {
            this.muestraInput=false;
            this.fUsuario.rfcDistribuidor.setValue('no aplica');
        }else{
            this.muestraInput=false;
            this.fUsuario.rfcDistribuidor.setValue('no aplica');
            for (const valor of this.fUsuario.roles.value) {
                //console.log(valor);
                    if (valor === 'distribuidor') {
                        this.muestraInput=true;
                        this.fUsuario.rfcDistribuidor.setValue('');
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
    get fUsuario() {
        return this.formulario.controls;
    }
}


