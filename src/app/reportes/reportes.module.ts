import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportesRoutingModule } from './reportes-routing.module';
import { ReporteVentasComponent } from './pages/reporte-ventas/reporte-ventas.component';
import { ReporteAbonosComponent } from './pages/reporte-abonos/reporte-abonos.component';


@NgModule({
  declarations: [
    ReporteVentasComponent,
    ReporteAbonosComponent
  ],
  imports: [
    CommonModule,
    ReportesRoutingModule
  ]
})
export class ReportesModule { }
