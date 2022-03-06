import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlternativosProductoComponent } from './pages/alternativos-producto/alternativos-producto.component';
import { HistorialProductoComponent } from './pages/historial-producto/historial-producto.component';
import { RegistroProductoComponent } from './pages/registro-producto/registro-producto.component';
import { RegistroPedidosComponent } from './pages/administracion-pedidos/registro-pedidos.component';

const routes: Routes = [
  {
    path:'',
    children:[
    {
    path:'alternativo-producto',   component:AlternativosProductoComponent,
    },
    {
      path:'historial-producto',   component:HistorialProductoComponent,
      },
      {
        path:'registro-producto',   component:RegistroProductoComponent,
        },
        {
          path:'registro-pedidos',   component:RegistroPedidosComponent,
          },
       
    ]
    
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductosRoutingModule { }
