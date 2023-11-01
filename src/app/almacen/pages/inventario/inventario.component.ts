import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { Product } from 'src/app/demo/domain/product';
import { ProductService } from 'src/app/demo/service/productservice';
import { AnaquelService } from 'src/app/shared/service/anaquel.service';
import { BodegasService } from 'src/app/shared/service/bodegas.service';
import { NivelService } from 'src/app/shared/service/nivel.service';
import { TcBodega } from '../../../productos/model/TcBodega';
import { TcAnaquel } from '../../../productos/model/TcAnaquel';
import { TcNivel } from 'src/app/productos/model/TcNivel';
import { BodegaProductosService } from '../../../shared/service/bodega-productos.service';
import { TwProductoBodega } from '../../../productos/model/TwProductoBodega';
import { VentasService } from '../../../shared/service/ventas.service';
import { producto } from '../../../productos/interfaces/producto.interfaces';
import { TcProducto } from 'src/app/productos/model/TcProducto';

@Component({
    selector: 'app-inventario',
    templateUrl: './inventario.component.html',
    styleUrls: ['./inventario.component.scss']

})
export class InventarioComponent implements OnInit {

    listaBodegas: TcBodega[];
    listaAnaquel: TcAnaquel[];
    listaNivel: TcNivel[];
    listaProductos: TwProductoBodega[] = [];
    bodega: number;
    anaquel: number;
    nivel: number;
    cols: any[];
    banderaMostrarPdf:boolean=false;
    productDialog:boolean;
    titulo:string;
    producto:TcProducto;


    constructor(private bodegasService: BodegasService,
        private anaquelService: AnaquelService,
        private nivelService: NivelService,
        private bodegasProductosService: BodegaProductosService,
        private ventasService:VentasService,
      private messageService: MessageService,
        ) {

        this.listaProductos = [];
       
        this.cols = [
            { field: 'tcProducto.sNoParte', header: 'No Parte' },
            { field: 'tcProducto.sProducto', header: 'Producto' },
            { field: 'tcProducto.sDescripcion', header: 'Descripcion' },
            { field: 'tcProducto.sMarca', header: 'Marca' },
            { field: 'tcBodega.sBodega', header: 'Bodega' },
            { field: 'tcAnaquel.sAnaquel', header: 'Anaquel' },
            { field: 'tcNivel.sNivel', header: 'Nivel' },
            { field: 'nCantidad', header: 'Cantidad' }

        ]
        this.productDialog=false;

    }

    ngOnInit() {

        this.bodegasService.obtenerBodegas().subscribe(bodegas => {
            this.listaBodegas = bodegas;
        });

        this.anaquelService.obtenerAnanquel().subscribe(anaquel => {
            this.listaAnaquel = anaquel;
        });

        this.nivelService.obtenerNivel().subscribe(nivel => {
            this.listaNivel = nivel;
        });
    }

    editar(tcProducto:TcProducto){
        this.productDialog=true
        this.titulo="Actualización del producto";
        this.producto=tcProducto;


    }

    consultaProducto() {

        if (this.bodega != undefined && this.anaquel != undefined && this.nivel != undefined) {
            this.banderaMostrarPdf=true;

                this.bodegasProductosService.consultaInventario(this.bodega, this.anaquel, this.nivel).subscribe(productos => {
                this.listaProductos = productos;
            });

        }

    }

    generarListadoPdf(){





if (this.bodega != undefined && this.anaquel != undefined && this.nivel != undefined) {
    this.banderaMostrarPdf=true;

  this.ventasService.generarInventarioPdf(this.bodega, this.anaquel, this.nivel).subscribe(resp => {

    
      const file = new Blob([resp], { type: 'application/pdf' });
      //console.log('file: ' + file.size);
      if (file != null && file.size > 0) {
        const fileURL = window.URL.createObjectURL(file);
        const anchor = document.createElement('a');
        anchor.download = 'inventario'+ '.pdf';
        anchor.href = fileURL;
        anchor.click();
        this.messageService.add({severity: 'success', summary: 'Se realizó con éxito', detail: 'Listado generado con éxito', life: 3000});
        //una vez generado el reporte limpia el formulario para una nueva venta o cotización 
       
      } else {
        this.messageService.add({severity: 'error', summary: 'Error', detail: 'Error al generar el listado', life: 3000});
      }

  });
}
else{
    this.messageService.add({severity: 'error', summary: 'Error', detail: 'Debes seleccionar todos los valores', life: 3000});
}

}

hideDialog(){

    this.productDialog=false;
    
}



}





