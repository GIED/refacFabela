import { Component, OnInit } from '@angular/core';
import { Product } from '../../../demo/domain/product';
import { ProductService } from '../../../demo/service/productservice';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { UsuarioService } from '../../service/usuario.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuarios } from '../../interfaces/usuarios';

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

    listaUsuarios: Usuarios[];
    formulario: FormGroup;
    usuarioDialog: boolean;
    usuario: Usuarios;

    constructor(private usuarioService: UsuarioService, private fb: FormBuilder, private messageService: MessageService,
        private confirmationService: ConfirmationService) {
        this.crearFormulario()

    }

    ngOnInit() {
        this.obtenerUsuarios();
    }

    obtenerUsuarios() {
        this.usuarioService.getUsuarios().subscribe(usuarios => {
            this.listaUsuarios = usuarios;
        })
    }
    get validaNomUsu() {
        return this.formulario.get('sNombreusuario').invalid && this.formulario.get('sNombreusuario').touched;
    }
    get validaUsuario() {
        return this.formulario.get('sUsuario').invalid && this.formulario.get('sUsuario').touched;
    }
    get validaPassword() {
        return this.formulario.get('sPassword').invalid && this.formulario.get('sPassword').touched;
    }

    // Crear formulario con sus validaciones de clientes
    crearFormulario() {
        this.formulario = this.fb.group({
            nId: ['', []],
            nPerfil: ['', []],
            nEstatus: ['', []],
            sClaveuser: ['', []],
            sNombreusuario: ['', [Validators.required]],
            sUsuario: ['', [Validators.required]],
            sPassword: ['', [Validators.required]],
        })
    }

    openNew() {
        this.limpiarFormulario();
        this.usuarioDialog = true;
    }


    editUsuario(usuario: Usuarios) {
        this.usuarioDialog = true;
        this.fUsuario.nId.setValue(usuario.nId);
        this.fUsuario.nPerfil.setValue(usuario.nPerfil);
        this.fUsuario.nEstatus.setValue(usuario.nEstatus);
        this.fUsuario.sClaveuser.setValue(usuario.sClaveuser);
        this.fUsuario.sNombreusuario.setValue(usuario.sNombreusuario);
        this.fUsuario.sUsuario.setValue(usuario.sUsuario);
        this.fUsuario.sPassword.setValue(usuario.sPassword);

    }

    limpiarFormulario() {
        this.fUsuario.nId.setValue("");
        this.fUsuario.nPerfil.setValue("");
        this.fUsuario.nEstatus.setValue("");
        this.fUsuario.sClaveuser.setValue("");
        this.fUsuario.sNombreusuario.setValue("");
        this.fUsuario.sUsuario.setValue("");
        this.fUsuario.sPassword.setValue("");
    }

    deleteUsuario(usuario: Usuarios) {
        this.confirmationService.confirm({
            message: 'Estas seguro que deseas desactivar al usuario ' + usuario.sNombreusuario + '?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                usuario.nEstatus = 0;
                this.usuarioService.guardaUsuario(usuario).subscribe(usuarioDesactivado => {
                    this.listaUsuarios[this.findIndexById(usuarioDesactivado.nId.toString())] = usuarioDesactivado;
                    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'usuario desactivado', life: 3000 });
                })
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
            this.usuario = this.formulario.value;

            if (this.usuario.nId) {
                this.usuarioService.guardaUsuario(this.usuario).subscribe(usuarioActualizado => {
                    this.listaUsuarios[this.findIndexById(usuarioActualizado.nId.toString())] = usuarioActualizado;
                    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'usuario actualizado', life: 10000 });
                })
            }
            else {
                this.usuario.sClaveuser = this.createId();
                this.usuario.nPerfil = 1;
                this.usuario.nEstatus = 1;
                this.usuarioService.guardaUsuario(this.usuario).subscribe(usuarioNuevo => {
                    this.listaUsuarios.push(usuarioNuevo);
                    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'usuario guardado', life: 10000 });
                })
            }
            this.listaUsuarios = [...this.listaUsuarios];
            this.usuarioDialog = false;
            this.usuario = {};
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


