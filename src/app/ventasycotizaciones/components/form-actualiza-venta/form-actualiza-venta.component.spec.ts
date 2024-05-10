import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormActualizaVentaComponent } from './form-actualiza-venta.component';

describe('FormActualizaVentaComponent', () => {
  let component: FormActualizaVentaComponent;
  let fixture: ComponentFixture<FormActualizaVentaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormActualizaVentaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormActualizaVentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
