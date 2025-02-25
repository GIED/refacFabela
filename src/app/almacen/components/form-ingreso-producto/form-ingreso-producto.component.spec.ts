import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormIngresoProductoComponent } from './form-ingreso-producto.component';

describe('FormIngresoProductoComponent', () => {
  let component: FormIngresoProductoComponent;
  let fixture: ComponentFixture<FormIngresoProductoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormIngresoProductoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormIngresoProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
