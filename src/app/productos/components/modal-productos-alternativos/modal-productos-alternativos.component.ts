import { Component, Input, OnInit } from "@angular/core";
import { TwProductoAlternativo } from '../../model/TwProductoAlternativo';
import { ProductoService } from "src/app/shared/service/producto.service";
import { NgxSpinnerService } from "ngx-spinner";
import { TcProducto } from "../../model/TcProducto";
import { MessageService } from "primeng/api";
import { producto } from '../../interfaces/producto.interfaces';

@Component({
  selector: "app-modal-productos-alternativos",
  templateUrl: "./modal-productos-alternativos.component.html",
  styleUrls: ["./modal-productos-alternativos.component.scss"],
})
export class ModalProductosAlternativosComponent implements OnInit {
  @Input() nIdProducto: number;
  @Input() sProducto: string;

  

  listaProductoAlternativo: TwProductoAlternativo[] = [];

  productDialog: boolean = false;
  titulo: string;

  constructor(
    private productosService: ProductoService,
    private spinner: NgxSpinnerService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.obtenerProductosAlternativos();
  }

  obtenerProductosAlternativos() {
    this.spinner.show();
    this.productosService
      .obtenerProductosAlternativos(this.nIdProducto)
      .subscribe((productosAlter) => {
        this.listaProductoAlternativo = productosAlter;
        this.spinner.hide();
      });
  }

  registroAlternativos() {
    // this.product = {};
    this.productDialog = true;
    this.titulo = "Registro de Productos Alternativos";
  }

  saveProduct(producto: TcProducto) {

  let twProductoAlternativo = new TwProductoAlternativo(null,1,null,this.nIdProducto,producto);
  console.log(twProductoAlternativo);

  this.productosService.guardaProductoAlternativo(twProductoAlternativo).subscribe(newProdAlt =>{
    this.obtenerProductosAlternativos();
  });
   
  

   
  }

  hideDialog(valor: boolean) {
    this.productDialog = valor;
  }
}
