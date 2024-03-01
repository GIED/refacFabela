import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CotizacionesClienteVigentesComponent } from './cotizaciones-cliente-vigentes.component';

describe('CotizacionesClienteVigentesComponent', () => {
  let component: CotizacionesClienteVigentesComponent;
  let fixture: ComponentFixture<CotizacionesClienteVigentesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CotizacionesClienteVigentesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CotizacionesClienteVigentesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
