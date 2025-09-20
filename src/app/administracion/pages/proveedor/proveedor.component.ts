import { Component, OnInit } from '@angular/core';
import { Product } from '../../../demo/domain/product';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { Clientes } from '../../interfaces/clientes';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProveedorService } from '../../service/proveedor.service';
import { Proveedores } from '../../interfaces/proveedores';
import { CatalogoService } from '../../../shared/service/catalogo.service';
import { TcTipoProveedor } from '../../interfaces/TcTipoProveedor';

@Component({
  selector: 'app-proveedor',
  templateUrl: './proveedor.component.html',
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
export class ProveedorComponent implements OnInit {

  listaProveedores: Proveedores[] = [];
  proveedorDialog: boolean;
  selectedProducts: Product[] = [];
  submitted: boolean;
  credito: boolean;
  proveedor: Proveedores = new Proveedores();
  formulario: FormGroup;
  listaTipoProveedor:TcTipoProveedor[]=[];


  constructor(private messageService: MessageService,
    private confirmationService: ConfirmationService, private proveedorService: ProveedorService, private fb: FormBuilder, private _catalogoService:CatalogoService) {
  }

  ngOnInit() {
    

    this._catalogoService.getTipoProveedor().subscribe(data=>{

      this.listaTipoProveedor=data;
      this.obtenerProveedores();
 
        this.formulario = this.fb.group({
          sRfc: ['', [Validators.required, Validators.minLength(13), Validators.maxLength(14)]],
          sRazonSocial: ['', [Validators.required]],
          sDireccion: ['', [Validators.required]],
          sTelefono: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
          nId: ['', []],
          nIdTipoProveedor: ['', [Validators.required]],
        })
      

    })

    
  }

  // Crear formulario con sus validaciones de clientes
 

  

  // Validación de campos Guardar Cliente
  get validaRfc() {
    return this.formulario.get('sRfc').invalid && this.formulario.get('sRfc').touched;
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
  get validaTipoProveedor() {
    return this.formulario.get('nIdTipoProveedor').invalid && this.formulario.get('nIdTipoProveedor').touched;
  }
  // Carga de clientes inicial(Todos)
  obtenerProveedores() {
    this.proveedorService.getProveedores().subscribe(provedores => {
      this.listaProveedores = provedores;
    })
  }

  openNew() {
    this.proveedor = new Proveedores();
    this.submitted = false;
    this.proveedorDialog = true;
    this.limpiarFormulario();
  }
  lineaCredito() {
    this.proveedor = {};
    this.submitted = false;
    this.credito = true;
  }
   limpiarFormulario() {
    if (!this.formulario) return;
    this.formulario.reset(); // ✅ más limpio que setValue uno por uno
  }

  //edita los daros del cliente
  editar(proveedor: Proveedores) {
    this.proveedorDialog = true;
    this.fproveedor.nId.setValue(proveedor.nId);
    this.fproveedor.sTelefono.setValue(proveedor.sTelefono);
    this.fproveedor.sDireccion.setValue(proveedor.sDireccion);
    this.fproveedor.sRazonSocial.setValue(proveedor.sRazonSocial);
    this.fproveedor.sRfc.setValue(proveedor.sRfc);
    this.fproveedor.nIdTipoProveedor.setValue(proveedor.nIdTipoProveedor);

  }

  get fproveedor() {
    return this.formulario.controls
  }

  //Elimina (cambia estatus de clieente como eliminación logica del registro)
  eliminar(proveedor: Proveedores) {
    this.confirmationService.confirm({
      message: 'Realmente quieres borrar al Proveedor ' + proveedor.sRazonSocial + '?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        proveedor.nEstatus = 0;
        this.proveedorService.guardaProveedores(proveedor).subscribe(respuesta => {
          this.listaProveedores = this.listaProveedores.filter(val => val.nId !== proveedor.nId);
          this.proveedor = new Proveedores();
          this.messageService.add({ severity: 'success', summary: 'Se realizó con éxito', detail: 'Proveedor eliminado', life: 3000 });
        })
      }
    });
  }

  hideDialog() {
    this.limpiarFormulario();
    this.proveedorDialog = false;
    this.submitted = false;
  }

  //Guardar nuevo cliente 
  guardar() {
  if (this.formulario.invalid) {
    return Object.values(this.formulario.controls).forEach(control => {
      if (control instanceof FormGroup) {
        Object.values(control.controls).forEach(c => c.markAsTouched());
      } else {
        control.markAsTouched();
      }
    });
  }

  this.proveedor = { ...this.formulario.value, nEstatus: 1 };

  if (this.proveedor.nId) {
    // Actualiza
    this.proveedorService.guardaProveedores(this.proveedor).subscribe(respuesta => {
       this.obtenerProveedores();
      this.messageService.add({
        severity: 'success',
        summary: 'Se realizó con éxito',
        detail: 'Proveedor actualizado',
        life: 10000
      });
    });
  } else {
    // Guarda nuevo
    this.proveedorService.guardaProveedores(this.proveedor).subscribe(respuesta => {
       this.obtenerProveedores();
      this.messageService.add({
        severity: 'success',
        summary: 'Se realizó con éxito',
        detail: 'Proveedor guardado',
        life: 10000
      });
    });
  }

  this.listaProveedores = [...this.listaProveedores];
  this.proveedorDialog = false;

  // ✅ Reinicia proveedor con objeto seguro
  this.proveedor = {
    nId: 0,
    sRfc: '',
    sRazonSocial: '',
    sDireccion: '',
    sTelefono: '',
    nIdTipoProveedor: null,
    nEstatus: 1,
    tcTipoProveedor: null
  };

  this.formulario.reset();
}
  //busqueda por id del cliente y regresa el index
  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.listaProveedores.length; i++) {
      if (this.listaProveedores[i].nId === parseInt(id)) {
        index = i;
        break;
      }
    }
    return index;
  }
}
