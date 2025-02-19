import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormProductoFacturaComponent } from './form-producto-factura.component';

describe('FormProductoFacturaComponent', () => {
  let component: FormProductoFacturaComponent;
  let fixture: ComponentFixture<FormProductoFacturaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormProductoFacturaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormProductoFacturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
