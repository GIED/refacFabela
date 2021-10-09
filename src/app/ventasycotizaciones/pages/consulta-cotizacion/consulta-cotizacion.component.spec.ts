import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaCotizacionComponent } from './consulta-cotizacion.component';

describe('ConsultaCotizacionComponent', () => {
  let component: ConsultaCotizacionComponent;
  let fixture: ComponentFixture<ConsultaCotizacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultaCotizacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaCotizacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
