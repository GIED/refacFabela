import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturasProveedorComponent } from './facturas-proveedor.component';

describe('FacturasProveedorComponent', () => {
  let component: FacturasProveedorComponent;
  let fixture: ComponentFixture<FacturasProveedorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FacturasProveedorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FacturasProveedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
