import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { CancelaVentaComponent } from "./pages/cancela-venta/cancela-venta.component";
import { ConsultaCotizacionComponent } from "./pages/consulta-cotizacion/consulta-cotizacion.component";
import { ConsultaVentaComponent } from "./pages/consulta-venta/consulta-venta.component";
import { VentasComponent } from "./pages/ventas/ventas.component";
import { VentasPorPedidoComponent } from "./pages/ventas-por-pedido/ventas-por-pedido.component";

const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "ventas",
        component: VentasComponent,
      },
      {
        path: "ventas-por-pedido",
        component: VentasPorPedidoComponent,
      },
      {
        path: "consulta-venta",
        component: ConsultaVentaComponent,
      },
      {
        path: "consulta-cotizacion",
        component: ConsultaCotizacionComponent,
      },
      {
        path: "cancela-venta",
        component: CancelaVentaComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VentasycotizacionesRoutingModule {}
