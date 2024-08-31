import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturaMonedaProveedorComponent } from './factura-moneda-proveedor.component';

describe('FacturaMonedaProveedorComponent', () => {
  let component: FacturaMonedaProveedorComponent;
  let fixture: ComponentFixture<FacturaMonedaProveedorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FacturaMonedaProveedorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FacturaMonedaProveedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
