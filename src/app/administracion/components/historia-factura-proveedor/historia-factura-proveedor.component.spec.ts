import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriaFacturaProveedorComponent } from './historia-factura-proveedor.component';

describe('HistoriaFacturaProveedorComponent', () => {
  let component: HistoriaFacturaProveedorComponent;
  let fixture: ComponentFixture<HistoriaFacturaProveedorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoriaFacturaProveedorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoriaFacturaProveedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
