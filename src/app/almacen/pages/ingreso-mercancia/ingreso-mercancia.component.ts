import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/demo/service/productservice';
import { Product } from 'src/app/demo/domain/product';

@Component({
  selector: 'app-ingreso-mercancia',
  templateUrl: './ingreso-mercancia.component.html',
  styleUrls: ['./ingreso-mercancia.component.scss']
})
export class IngresoMercanciaComponent implements OnInit {

  products: Product[];


  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.productService.getProductsWithOrdersSmall().then(data => this.products = data);
  }

}
