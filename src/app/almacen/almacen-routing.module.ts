import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IngresoMercanciaComponent } from './ingreso-mercancia/ingreso-mercancia.component';
import { TraspasosComponent } from './traspasos/traspasos.component';
import { InventarioComponent } from './inventario/inventario.component';
import { EntregaDeMercanciaComponent } from './entrega-de-mercancia/entrega-de-mercancia.component';
import { StockMinimoComponent } from './stock-minimo/stock-minimo.component';

const routes: Routes = [
  {
    path:'',
    children:[
    {
    path:'ingreso-mercancia',   component:IngresoMercanciaComponent,
    },
    {
      path:'traspasos',   component:TraspasosComponent,
      },
      {
        path:'inventario',   component:InventarioComponent,
        },
        {
          path:'entrega-de-mercancia',   component:EntregaDeMercanciaComponent,
          },
          {
            path:'stock-minimo',   component:StockMinimoComponent,
            },
           
    ]
    
  }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlmacenRoutingModule { }
