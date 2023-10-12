import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaAjusteInventarioComponent } from './consulta-ajuste-inventario.component';

describe('ConsultaAjusteInventarioComponent', () => {
  let component: ConsultaAjusteInventarioComponent;
  let fixture: ComponentFixture<ConsultaAjusteInventarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultaAjusteInventarioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaAjusteInventarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
