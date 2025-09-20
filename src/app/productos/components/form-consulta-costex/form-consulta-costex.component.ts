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
import { ProductoService } from 'src/app/shared/service/producto.service';

const toNumber = (v: unknown): number | null => {
  if (v === null || v === undefined) return null;
  const cleaned = String(v).trim().replace(/[^0-9.\-]/g, '');
  if (!cleaned || cleaned === '-' || cleaned === '.' || cleaned === '-.') return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
};

// Convierte a Decimal de forma segura (devuelve 0 si no es válido)
const toDecimal = (v: unknown): Decimal => {
  const n = toNumber(v);
  return n === null ? new Decimal(0) : new Decimal(n);
};

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
  productoForm: TcProducto
  largoCm: Decimal | null = null;
  anchoCm: Decimal | null = null;
  altoCm: Decimal | null = null;
  volumenCm: Decimal | null = null;

  constructor(private fb: FormBuilder, private partService: PartService, public dialogService: DialogService, private _productosService: ProductoService,
    private _tokenService: TokenService
  ) {

    this.producto = new TcProducto();
    this.productoForm = new TcProducto();

    this.form = this.fb.group({
      numeroParte: ['', Validators.required],
      cantidad: ['1', [Validators.required, Validators.pattern('^[0-9]+$')]]
    });

    this.largoCm = new Decimal(0);
    this.anchoCm = new Decimal(0);
    this.altoCm = new Decimal(0);
    this.volumenCm = new Decimal(0);

  }

  // Quita todo excepto dígitos, punto y signo; convierte a number.


  consultar() {
  if (this.form.valid) {
    const { numeroParte, cantidad } = this.form.value;
    this.partService.obtenerProductoCostex(numeroParte, cantidad).subscribe({
      next: (resp) => {
        this.resultado = resp;
        console.log('resultado', this.resultado);
        this.error = undefined;

        // ⭐ Normaliza locations a tipos numéricos
        this.locationList = Object.values(resp.Locations || {}).map((loc: any) => ({
          ...loc,
          CustPrice: toNumber(loc.CustPrice) ?? 0,
          NetQtyStock: toNumber(loc.NetQtyStock) ?? 0,
          BranchTaxPr: toNumber(loc.BranchTaxPr) ?? 0,
        })) as unknown as LocationPart[];

        // Conversión pulgadas → cm
        const factorPulgadasACm = new Decimal(2.54);
        const redondear = (valor: Decimal) => valor.toDecimalPlaces(2);

        // Ojo: por si llegan strings, usa toDecimal para evitar NaN de Decimal
        this.largoCm  = this.resultado.dblLengthIn ? redondear(toDecimal(this.resultado.dblLengthIn).mul(factorPulgadasACm)) : null;
        this.anchoCm  = this.resultado.dblWidthIn  ? redondear(toDecimal(this.resultado.dblWidthIn).mul(factorPulgadasACm)) : null;
        this.altoCm   = this.resultado.dblHeightIn ? redondear(toDecimal(this.resultado.dblHeightIn).mul(factorPulgadasACm)) : null;
        this.volumenCm = this.largoCm && this.anchoCm && this.altoCm
          ? redondear(this.largoCm.mul(this.anchoCm).mul(this.altoCm))
          : null;
      },
      error: (err) => {
        this.resultado = undefined;
        this.error = 'Error al consultar: ' + err.message;
      }
    });
  }
}

  async castToProducto(): Promise<TcProducto> {
  const nIdMarca = 53;
  const numeroParte = this.numeroParte.value;

  // Espera la respuesta del servicio (RxJS 6)
  const productoExistente = await this._productosService
    .getProductoByNoParteAndIdMarca(numeroParte, nIdMarca)
    .toPromise();

  let p: TcProducto;

  if (productoExistente) {
    p = productoExistente;

    if (p.nLargo == null && p.nAncho == null && p.nAlto == null) {
      p.nLargo = this.largoCm;
      p.nAncho = this.anchoCm;
      p.nAlto  = this.altoCm;
      p.nVolumen = this.volumenCm;
    }
  } else {
    p = new TcProducto();
    p.sNoParte   = numeroParte;
    p.sProducto  = this.resultado?.strDescrip1 ?? '';
    p.sMarca     = 'CTP';
    p.nIdMarca   = nIdMarca;
    p.nIdusuario = this._tokenService.getIdUser();
    p.nPeso      = this.resultado?.dblWeigthKgs ? new Decimal(this.resultado.dblWeigthKgs) : new Decimal(0);
    p.nLargo     = this.largoCm;
    p.nAlto      = this.altoCm;
    p.nAncho     = this.anchoCm;
    p.nVolumen   = this.volumenCm;
  }

  this.producto = p;
  return p;
}




  async formProducto(loc: LocationPart): Promise<void> {
  // Espera a que se termine de construir el producto
  this.productoForm = await this.castToProducto();
    this.productoForm.nPrecio = loc.CustPrice ? new Decimal(loc.CustPrice) : new Decimal(0);
    this.productoForm.sMoneda = 'USD';

    console.log('producto en form: ',this.productoForm);

    const isNuevo = !this.productoForm || typeof this.productoForm.nId !== 'number' || this.productoForm.nId == null || this.productoForm.nId === 0;

    const modo = isNuevo ? ModeActionOnModel.CREATING : ModeActionOnModel.EDITING;
    console.log('Este el modo', modo);

    const ref = this.dialogService.open(FormProductoComponent, {
      data: new ModelContainer(modo, this.productoForm),
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