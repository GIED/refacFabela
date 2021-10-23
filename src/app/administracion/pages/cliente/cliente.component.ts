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

  // Crear formulario con sus validaciones de clientes
  crearFormulario() {

    this.formulario = this.fb.group({
      sRfc: ['', [Validators.required, Validators.minLength(12),  Validators.maxLength(14)]],
      sRazonSocial:['',[Validators.required]],
      sDireccion:['',[Validators.required]],
      sTelefono:['',[Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      sCorreo:['',[Validators.required, Validators.email]],
      nId:['',[]]

    })

  }

  // Validación de campos Guardar Cliente
  get validaRfc() {
    return this.formulario.get('sRfc').invalid ;
  }
  get validaRS() {
    return this.formulario.get('sRazonSocial').invalid && this.formulario.get('sRazonSocial').touched;
  }
  get validaDireccion() {
    return this.formulario.get('sDireccion').invalid && this.formulario.get('sDireccion').touched;
  }
  get validaTelefono() {
    return this.formulario.get('sTelefono').invalid && this.formulario.get('sTelefono').touched;
  }
  get validaCorreo() {
    return this.formulario.get('sCorreo').invalid && this.formulario.get('sCorreo').touched;
  }



// Carga de clientes inicial(Todos)
  obtenerClientes(){

    this.clienteService.getClientes().subscribe(clientes=>{
        this.listaClientes=clientes;
    })
  }

  openNew() {
      this.cliente = {};
      this.submitted = false;
      this.clienteDialog = true;

      this.limpiarFormulario();

    
    
  }

  limpiarFormulario(){

    this.fclientes.nId.setValue("");
    this.fclientes.sCorreo.setValue("");
    this.fclientes.sTelefono.setValue("");
    this.fclientes.sDireccion.setValue("");
    this.fclientes.sRazonSocial.setValue("");
    this.fclientes.sRfc.setValue("");
    this.fclientes.sClave.setValue("");

  }


  lineaCredito(){
    this.cliente = {};
    this.submitted = false;
    this.credito = true;
    

  }
 
//edita los daros del cliente
  editar(cliente: Clientes) {
    this.clienteDialog = true;
     this.fclientes.nId.setValue(cliente.nId);
     this.fclientes.sCorreo.setValue(cliente.sCorreo);
     this.fclientes.sTelefono.setValue(cliente.sTelefono);
     this.fclientes.sDireccion.setValue(cliente.sDireccion);
     this.fclientes.sRazonSocial.setValue(cliente.sRazonSocial);
     this.fclientes.sRfc.setValue(cliente.sRfc);
     this.fclientes.sClave.setValue(cliente.sClave);
    



     
  }

  get fclientes(){
      return this.formulario.controls
  }

  //Elimina (cambia estatus de clieente como eliminación logica del registro)
  eliminar(cliente: Clientes) {
      this.confirmationService.confirm({
          message: 'Realmente quieres borrar el cliente ' + cliente.sRazonSocial + '?',
          header: 'Confirmar',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {

            cliente.nEstatus=0;  
            this.clienteService.guardaCliente(cliente).subscribe(respuesta=>{

              this.listaClientes = this.listaClientes.filter(val => val.nId !== cliente.nId);
              this.cliente = {};
              this.messageService.add({severity: 'success', summary: 'Successful', detail: 'Cliente eliminado', life: 3000});})
          }
      });
  }

  hideDialog() {
      this.clienteDialog = false;
      this.submitted = false;
  }

 //Guardar nuevo cliente 
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
                this.cliente.nEstatus=1;  

                this.clienteService.guardaCliente(this.cliente).subscribe(respuesta=>{

                    this.listaClientes[this.findIndexById(respuesta.nId.toString())] = respuesta;
                    this.messageService.add({severity: 'success', summary: 'Successful', detail: 'Cliente actualizado', life: 10000});

                })          
                
                
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


 //busqueda por id del cliente y regresa el index
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

  //Crear una nueva clave de cliente
  crearId(): string {
      let id = '';
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      for ( let i = 0; i < 5; i++ ) {
          id += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return id;
  }

  

  
}
