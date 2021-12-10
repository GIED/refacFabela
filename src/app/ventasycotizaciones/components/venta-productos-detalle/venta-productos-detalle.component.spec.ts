import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentaProductosDetalleComponent } from './venta-productos-detalle.component';

describe('VentaProductosDetalleComponent', () => {
  let component: VentaProductosDetalleComponent;
  let fixture: ComponentFixture<VentaProductosDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VentaProductosDetalleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VentaProductosDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
