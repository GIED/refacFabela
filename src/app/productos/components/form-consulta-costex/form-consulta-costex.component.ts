import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PartResponse } from '../../model/PartResponse ';
import { PartService } from 'src/app/shared/service/part.service';
import { LocationPart } from '../../model/PartLocation ';
import { TcProducto } from '../../model/TcProducto';
import { ModeActionOnModel } from 'src/app/shared/utils/model-action-on-model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { FormProductoComponent } from '../form-producto/form-producto.component';
import { ModelContainer } from 'src/app/shared/utils/model-container';
import { producto } from '../../interfaces/producto.interfaces';
import { TokenService } from 'src/app/shared/service/token.service';
import { Model } from 'src/app/shared/utils/model';
import Decimal from 'decimal.js';

@Component({
  selector: 'app-form-consulta-costex',
  templateUrl: './form-consulta-costex.component.html'
})
export class FormConsultaCostexComponent {
  form: FormGroup;
  resultado?: PartResponse;
  error?: string;
  locationList: LocationPart[] = [];
  producto: TcProducto
  largoCm: Decimal | null = null;
  anchoCm: Decimal | null = null;
  altoCm: Decimal | null = null;
  volumenCm: Decimal | null = null;

  constructor(private fb: FormBuilder, private partService: PartService, private messageService: MessageService,
    private confirmationService: ConfirmationService, public dialogService: DialogService, private _tokenService: TokenService) {

    this.producto = new TcProducto();

    this.form = this.fb.group({
      numeroParte: ['', Validators.required],
      cantidad: ['1', [Validators.required, Validators.pattern('^[0-9]+$')]]
    });

    this.largoCm = new Decimal(0);
    this.anchoCm = new Decimal(0);
    this.altoCm = new Decimal(0);
    this.volumenCm = new Decimal(0);

  }

  consultar() {
    if (this.form.valid) {
      const { numeroParte, cantidad } = this.form.value;
      this.partService.obtenerProductoCostex(numeroParte, cantidad).subscribe({
        next: (resp) => {
          this.resultado = resp;
          this.error = undefined;
          this.locationList = Object.values(resp.Locations || {});
          const factorPulgadasACm = new Decimal(2.54);
          const redondear = (valor: Decimal) => valor.toDecimalPlaces(2);

          this.largoCm = this.resultado.dblLengthIn ? redondear(new Decimal(this.resultado.dblLengthIn).mul(factorPulgadasACm)) : null;
          this.anchoCm = this.resultado.dblWidthIn ? redondear(new Decimal(this.resultado.dblWidthIn).mul(factorPulgadasACm)) : null;
          this.altoCm = this.resultado.dblHeightIn ? redondear(new Decimal(this.resultado.dblHeightIn).mul(factorPulgadasACm)) : null;
          this.volumenCm = this.largoCm && this.anchoCm && this.altoCm ? redondear(this.largoCm.mul(this.anchoCm).mul(this.altoCm)) : null;
        },
        error: (err) => {
          this.resultado = undefined;
          this.error = 'Error al consultar: ' + err.message;
        }
      });
    }
  }

  castToProducto(): Model {
    const factorPulgadasACm = new Decimal(2.54);
    const redondear = (valor: Decimal) => valor.toDecimalPlaces(2);

    const largoCm = this.resultado.dblLengthIn ? redondear(new Decimal(this.resultado.dblLengthIn).mul(factorPulgadasACm)) : null;
    const anchoCm = this.resultado.dblWidthIn ? redondear(new Decimal(this.resultado.dblWidthIn).mul(factorPulgadasACm)) : null;
    const altoCm = this.resultado.dblHeightIn ? redondear(new Decimal(this.resultado.dblHeightIn).mul(factorPulgadasACm)) : null;
    const volumenCm = largoCm && anchoCm && altoCm ? redondear(largoCm.mul(anchoCm).mul(altoCm)) : null;

    this.producto.sNoParte = this.numeroParte.value;
    this.producto.sProducto = this.resultado.strDescrip1;
    this.producto.sMarca = 'CTP';
    this.producto.nIdMarca = 53;
    this.producto.nIdusuario = this._tokenService.getIdUser();
    this.producto.nPeso = this.resultado.dblWeigthKgs ? new Decimal(this.resultado.dblWeigthKgs) : new Decimal(0);
    this.producto.nLargo = largoCm;
    this.producto.nAlto = altoCm;
    this.producto.nAncho = anchoCm;
    this.producto.nVolumen = volumenCm;
    // this.producto.nPrecioPeso= new Decimal(0);
    // this.producto.nPrecio= new Decimal(0);
    // this.producto.nPrecioSinIva=new Decimal(0);
    // this.producto.nPrecioConIva=new Decimal(0);
    // this.producto.nPrecioIva=new Decimal(0);




    return this.producto;

  }




  formProducto(): void {

    const isNuevo = !this.producto || typeof this.producto.nId !== 'number' || this.producto.nId == null || this.producto.nId === 0;

    const modo = isNuevo ? ModeActionOnModel.CREATING : ModeActionOnModel.EDITING;
    console.log('Este el modo', modo);

    const ref = this.dialogService.open(FormProductoComponent, {
      data: new ModelContainer(modo, this.castToProducto() as TcProducto),
      header: isNuevo ? 'Nuevo Producto' : 'Editar Producto',
      width: '70%',
      height: 'auto',
      baseZIndex: 1000,
      closable: true,
      dismissableMask: true,
      modal: true
    });

    ref.onClose.subscribe((productoGuardado: TcProducto | undefined) => {
      if (productoGuardado) {
        // Aquí puedes actualizar tu lista, tabla, etc.
        console.log('Producto recibido desde el diálogo:', productoGuardado);
        // Ejemplo: recargar lista o actualizar tabla
        // this.informacionProducto(productoGuardado.nId); // o lo que apliques
      } else {
        console.log('El usuario cerró el formulario sin guardar.');
      }
    });
  }

  get numeroParte() {
    return this.form.get('numeroParte') as FormControl;
  }



}