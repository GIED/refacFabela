import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CotizacionProductoComponent } from './cotizacion-producto.component';

describe('CotizacionProductoComponent', () => {
  let component: CotizacionProductoComponent;
  let fixture: ComponentFixture<CotizacionProductoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CotizacionProductoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CotizacionProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
