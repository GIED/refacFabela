import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CotizacionClienteProductoComponent } from './cotizacion-cliente-producto.component';

describe('CotizacionClienteProductoComponent', () => {
  let component: CotizacionClienteProductoComponent;
  let fixture: ComponentFixture<CotizacionClienteProductoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CotizacionClienteProductoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CotizacionClienteProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
