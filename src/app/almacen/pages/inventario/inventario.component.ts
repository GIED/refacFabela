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


    constructor(private bodegasService: BodegasService,
        private anaquelService: AnaquelService,
        private nivelService: NivelService,
        private bodegasProductosService: BodegaProductosService,
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

    consultaProducto() {

        if (this.bodega != undefined && this.anaquel != undefined && this.nivel != undefined) {

                this.bodegasProductosService.consultaInventario(this.bodega, this.anaquel, this.nivel).subscribe(productos => {
                this.listaProductos = productos;
            });

        }

    }


}





