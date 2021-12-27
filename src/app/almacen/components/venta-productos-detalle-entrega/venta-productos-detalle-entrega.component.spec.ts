import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentaProductosDetalleEntregaComponent } from './venta-productos-detalle-entrega.component';

describe('VentaProductosDetalleEntregaComponent', () => {
  let component: VentaProductosDetalleEntregaComponent;
  let fixture: ComponentFixture<VentaProductosDetalleEntregaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VentaProductosDetalleEntregaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VentaProductosDetalleEntregaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
