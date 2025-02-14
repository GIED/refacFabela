import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormRegistroProductoFacturaComponent } from './form-registro-producto-factura.component';

describe('FormRegistroProductoFacturaComponent', () => {
  let component: FormRegistroProductoFacturaComponent;
  let fixture: ComponentFixture<FormRegistroProductoFacturaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormRegistroProductoFacturaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormRegistroProductoFacturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
