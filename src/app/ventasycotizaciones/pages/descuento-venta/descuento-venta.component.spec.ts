import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescuentoVentaComponent } from './descuento-venta.component';

describe('DescuentoVentaComponent', () => {
  let component: DescuentoVentaComponent;
  let fixture: ComponentFixture<DescuentoVentaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DescuentoVentaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DescuentoVentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
