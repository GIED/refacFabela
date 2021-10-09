import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ClienteComponent } from "./pages/cliente/cliente.component";
import { UsuarioComponent } from "./pages/usuario/usuario.component";
import { ProveedorComponent } from "./pages/proveedor/proveedor.component";
import { CreditosComponent } from "./pages/creditos/creditos.component";
import { TipoCambioComponent } from "./pages/tipo-cambio/tipo-cambio.component";

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
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdministracionRoutingModule {}
