import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ClienteComponent } from "./pages/cliente/cliente.component";
import { UsuarioComponent } from "./pages/usuario/usuario.component";
import { ProveedorComponent } from "./pages/proveedor/proveedor.component";
import { CreditosComponent } from "./pages/creditos/creditos.component";
import { TipoCambioComponent } from "./pages/tipo-cambio/tipo-cambio.component";
import { ValidaComprobanteComponent } from './pages/valida-comprobante/valida-comprobante.component';
import { AdminCajaComponent } from './pages/admin-caja/admin-caja.component';
import { TraspasoVentaACreditoComponent } from './pages/traspaso-venta-acredito/traspaso-venta-acredito.component';
import { ProductosCanceladosComponent } from "./pages/productos-cancelados/productos-cancelados.component";

const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "cliente",
        component: ClienteComponent,
      },
      {
        path: "usuario",
        component: UsuarioComponent,
      },
      {
        path: "proveedor",
        component: ProveedorComponent,
      },
      {
        path: "creditos",
        component: CreditosComponent,
      },
      {
        path: "tipo-cambio",
        component: TipoCambioComponent,
      },
      {
        path: "creditos",
        component: CreditosComponent,
      },
      {
        path: "validaComprobante",
        component: ValidaComprobanteComponent,
      },
      {
        path: "admin-caja",
        component: AdminCajaComponent,
      },
      {
        path: "traspaso-venta-credito",
        component: TraspasoVentaACreditoComponent,
      },
      {
        path: "productos-cancelados",
        component: ProductosCanceladosComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdministracionRoutingModule {}
