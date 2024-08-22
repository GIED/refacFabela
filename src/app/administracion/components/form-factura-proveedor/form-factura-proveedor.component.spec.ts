import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormFacturaProveedorComponent } from './form-factura-proveedor.component';

describe('FormFacturaProveedorComponent', () => {
  let component: FormFacturaProveedorComponent;
  let fixture: ComponentFixture<FormFacturaProveedorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormFacturaProveedorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormFacturaProveedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
