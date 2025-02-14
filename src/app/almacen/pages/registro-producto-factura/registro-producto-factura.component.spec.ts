import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroProductoFacturaComponent } from './registro-producto-factura.component';

describe('RegistroProductoFacturaComponent', () => {
  let component: RegistroProductoFacturaComponent;
  let fixture: ComponentFixture<RegistroProductoFacturaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistroProductoFacturaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroProductoFacturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
