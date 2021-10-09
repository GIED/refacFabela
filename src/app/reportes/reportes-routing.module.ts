import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReporteVentasComponent } from './pages/reporte-ventas/reporte-ventas.component';
import { ReporteAbonosComponent } from './pages/reporte-abonos/reporte-abonos.component';

const routes: Routes = [

  {
    path:'',
    children:[
    {
    path:'reporte-ventas',   component:ReporteVentasComponent,
    },
    {
      path:'reporte-abonos',   component:ReporteAbonosComponent,
      },
    
        
       
    ]
    
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportesRoutingModule { }
