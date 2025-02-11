import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { EntregaDeMercanciaComponent } from "./pages/entrega-de-mercancia/entrega-de-mercancia.component";
import { IngresoMercanciaComponent } from "./pages/ingreso-mercancia/ingreso-mercancia.component";
import { InventarioComponent } from "./pages/inventario/inventario.component";
import { StockMinimoComponent } from "./pages/stock-minimo/stock-minimo.component";
import { TraspasosComponent } from "./pages/traspasos/traspasos.component";
import { RegistroProductoFacturaComponent } from "./pages/registro-producto-factura/registro-producto-factura.component";

const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "ingreso-mercancia",
        component: IngresoMercanciaComponent,
      },
      {
        path: "traspasos",
        component: TraspasosComponent,
      },
      {
        path: "inventario",
        component: InventarioComponent,
      },
      {
        path: "entrega-de-mercancia",
        component: EntregaDeMercanciaComponent,
      },
      {
        path: "stock-minimo",
        component: StockMinimoComponent,
      },
      {
        path: "factura-producto",
        component: RegistroProductoFacturaComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AlmacenRoutingModule {}
