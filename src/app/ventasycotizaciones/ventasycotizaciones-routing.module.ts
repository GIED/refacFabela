import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { CancelaVentaComponent } from "./pages/cancela-venta/cancela-venta.component";
import { ConsultaCotizacionComponent } from "./pages/consulta-cotizacion/consulta-cotizacion.component";
import { ConsultaVentaComponent } from "./pages/consulta-venta/consulta-venta.component";
import { VentasComponent } from "./pages/ventas/ventas.component";
import { VentasPorPedidoComponent } from "./pages/ventas-por-pedido/ventas-por-pedido.component";
import { VentasPorInternetComponent } from './pages/ventas-por-internet/ventas-por-internet.component';
import { ProdGuardService } from '../shared/guards/prod-guard.service';
import { DescuentoVentaComponent } from './pages/descuento-venta/descuento-venta.component';

const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "ventas",canActivate:[ProdGuardService], data: {expectedRol: ['admin','ventas']},
        component: VentasComponent,
      },
      {
        path: "ventas-por-pedido",canActivate:[ProdGuardService], data: {expectedRol: ['admin','ventas']},
        component: VentasPorPedidoComponent,
      },
      {
        path: "consulta-venta",canActivate:[ProdGuardService], data: {expectedRol: ['admin','ventas']},
        component: ConsultaVentaComponent,
      },
      {
        path: "consulta-cotizacion",canActivate:[ProdGuardService], data: {expectedRol: ['admin','ventas']},
        component: ConsultaCotizacionComponent,
      },
      {
        path: "cancela-venta",canActivate:[ProdGuardService], data: {expectedRol: ['admin','ventas']},
        component: CancelaVentaComponent,
      },
      {
        path: "ventas-por-internet",  canActivate:[ProdGuardService], data: {expectedRol: ['admin','distribuidor']},
        component: VentasPorInternetComponent,
      },
      {
        path: "descuento-venta",  canActivate:[ProdGuardService], data: {expectedRol: ['admin']},
        component: DescuentoVentaComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VentasycotizacionesRoutingModule {}
