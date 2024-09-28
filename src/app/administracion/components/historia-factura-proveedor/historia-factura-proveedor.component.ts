import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ProveedorService } from '../../service/proveedor.service';
import { Proveedores } from '../../interfaces/proveedores';
import { TcMoneda } from 'src/app/productos/model/TcMoneda';
import { CatalogoService } from 'src/app/shared/service/catalogo.service';

@Component({
  selector: 'app-historia-factura-proveedor',
  templateUrl: './historia-factura-proveedor.component.html',
  styleUrls: ['./historia-factura-proveedor.component.scss']
})
export class HistoriaFacturaProveedorComponent implements OnInit {

  @Output() cerrar: EventEmitter<boolean> = new EventEmitter();
  formulario: FormGroup;
  listaProvedores: Proveedores[];
  listaMonedas: TcMoneda[];




  constructor(private messageService: MessageService,
    private confirmationService: ConfirmationService, private fb: FormBuilder, private proveedorService: ProveedorService, private catalogoService: CatalogoService) { }

  ngOnInit() {

    this.consultaproveedores();
    this.getMonegas();



    this.formulario = this.fb.group({
      n_id_proveedor: [null, Validators.required],
      n_id_moneda: [null, Validators.required]
    });
  }


  getMonegas() {
    this.catalogoService.obtenerMonedas().subscribe(data2 => {
      this.listaMonedas = data2;

    })
  }

  consultaproveedores() {

    this.proveedorService.getProveedores().subscribe(data => {

      this.listaProvedores = data;


    })

  }
  get validaNIdProveedor() {
    return this.formulario.get('n_id_proveedor').invalid && this.formulario.get('n_id_proveedor').touched;
  }
  get validaNIdMoneda() {
    return this.formulario.get('n_id_moneda').invalid && this.formulario.get('n_id_moneda').touched;
  }
  get fProducto(){
    return this.formulario.controls;
}



  onSubmit(): void {
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
      this.formulario.markAllAsTouched(); // Marca todos los campos como tocados
      console.log('formulario valido');
    }
  }




}
