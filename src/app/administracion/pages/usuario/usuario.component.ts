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

    formulario:FormGroup;

    usuarioDialog: boolean;
  
    
    usuario: Usuarios;
  
    

    constructor(private usuarioService: UsuarioService, private fb: FormBuilder, private messageService: MessageService,
                private confirmationService: ConfirmationService) {
                    this.crearFormulario()
       
    }
  
    ngOnInit() {
        this.obtenerUsuarios();
    
    }

    obtenerUsuarios(){
        this.usuarioService.getUsuarios().subscribe(usuarios => {
            this.listaUsuarios=usuarios;
        })
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

    // Crear formulario con sus validaciones de clientes
    crearFormulario() {
  
        this.formulario = this.fb.group({
            sNombreUsuario: ['', [Validators.required]],
            sUsuario:['',[Validators.required]],
            sPassword:['',[Validators.required]],
            
    
        })
    
      }
  
    openNew() {
        this.usuario = {};
        this.usuarioDialog = true;
       
    }
  
   
    editProduct(usuario: Usuarios) {
        this.usuario = {...usuario};
        this.usuarioDialog = true;
    }
  
    /*deleteProduct(product: Product) {
        this.confirmationService.confirm({
            message: 'Realmente quieres borrar el usuario ' + product.name + '?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.products = this.products.filter(val => val.id !== product.id);
                this.product = {};
                this.messageService.add({severity: 'success', summary: 'Successful', detail: 'usuario eliminado', life: 3000});
            }
        });
    }*/
  
    hideDialog() {
        this.usuarioDialog = false;
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
        }else{
                this.usuario = this.formulario.value;  
            
                if (this.usuario.nId) {

                    this.usuarioService.guardaCliente(this.usuario).subscribe(usuarioActualizado =>{
                        this.listaUsuarios[this.findIndexById(this.usuario.nId.toString())] = usuarioActualizado;
                    this.messageService.add({severity: 'success', summary: 'Successful', detail: 'usuario actualizado', life: 10000});
                    })

                }
                else {
                    this.usuario.sClaveuser = this.createId();
                    this.usuarioService.guardaCliente(this.usuario).subscribe(usuarioNuevo =>{
                        this.listaUsuarios.push(usuarioNuevo);
                        this.messageService.add({severity: 'success', summary: 'Successful', detail: 'usuario guardado', life: 10000});
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
        for ( let i = 0; i < 5; i++ ) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }
  
    
  
    
  }


