import {Component, OnInit} from '@angular/core';
import { Product } from '../../../demo/domain/product';
import { ProductService } from '../../../demo/service/productservice';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { ClienteService } from '../../service/cliente.service';
import { Clientes } from '../../interfaces/clientes';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';




@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
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
export class ClienteComponent implements OnInit {


  listaClientes:Clientes[]=[];  

  clienteDialog: boolean;

  selectedProducts: Product[];

  submitted: boolean;

  credito: boolean;
  cliente:Clientes;

  formulario:FormGroup;
  

  constructor( private messageService: MessageService,
              private confirmationService: ConfirmationService, private clienteService:ClienteService, private fb: FormBuilder,) {
                this.crearFormulario();
  }

  ngOnInit() {      
     
      this.obtenerClientes();
  }

  
  crearFormulario() {

    this.formulario = this.fb.group({
      sRfc: ['', []],
      sRazonSocial:['',[Validators.required]]

    })

  }
  get validaRfc() {
    return this.formulario.get('sRfc').invalid && this.formulario.get('sRfc').touched;
  }
  get validaRS() {
    return this.formulario.get('sRazonSocial').invalid && this.formulario.get('sRazonSocial').touched;
  }


  obtenerClientes(){

    this.clienteService.getClientes().subscribe(clientes=>{
        this.listaClientes=clientes;
    })
  }

  openNew() {
      this.cliente = {};
      this.submitted = false;
      this.clienteDialog = true;
  }
  lineaCredito(){
    this.cliente = {};
    this.submitted = false;
    this.credito = true;
    

  }
 

  editar(cliente: Clientes) {
      this.cliente = {...cliente};
      this.clienteDialog = true;
  }

  eliminar(cliente: Clientes) {
      this.confirmationService.confirm({
          message: 'Realmente quieres borrar el cliente ' + cliente.sRazonSocial + '?',
          header: 'Confirmar',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {

              this.listaClientes = this.listaClientes.filter(val => val.nId !== cliente.nId);
              this.cliente = {};
              this.messageService.add({severity: 'success', summary: 'Successful', detail: 'Cliente eliminado', life: 3000});
          }
      });
  }

  hideDialog() {
      this.clienteDialog = false;
      this.submitted = false;
  }

guardar() {

   
    if (this.formulario.invalid) {

        return Object.values(this.formulario.controls).forEach(control => {
  
          if (control instanceof FormGroup) {
            // tslint:disable-next-line: no-shadowed-variable
            
            Object.values(control.controls).forEach(control => control.markAsTouched());
          } else {
            control.markAsTouched();
          }
  
        });
    }
    else{
        this.cliente=this.formulario.value;
        console.log(this.cliente);


       
            if (this.cliente.nId) {
                this.listaClientes[this.findIndexById(this.cliente.nId.toString())] = this.cliente;
                this.messageService.add({severity: 'success', summary: 'Successful', detail: 'Cliente actualizado', life: 10000});
            }
            else {
                this.cliente.sClave = this.crearId();
                this.cliente.nEstatus=1;  
                this.clienteService.guardaCliente(this.cliente).subscribe(respuesta=>{

                    this.listaClientes.push(respuesta);
                this.messageService.add({severity: 'success', summary: 'Successful', detail: 'Cliente guardado', life: 10000});

                })          
                
            }
  
            this.listaClientes = [...this.listaClientes];
            this.clienteDialog = false;
            this.cliente = {};
        

    }

    
  }

  findIndexById(id: string): number {
      let index = -1;
      for (let i = 0; i < this.listaClientes.length; i++) {
          if (this.listaClientes[i].nId ===parseInt(id) ) {
              index = i;
              break;
          }
      }

      return index;
  }

  crearId(): string {
      let id = '';
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      for ( let i = 0; i < 5; i++ ) {
          id += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return id;
  }

  

  
}
