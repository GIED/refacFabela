import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductosAlternativosVentaComponent } from './productos-alternativos-venta.component';

describe('ProductosAlternativosVentaComponent', () => {
  let component: ProductosAlternativosVentaComponent;
  let fixture: ComponentFixture<ProductosAlternativosVentaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductosAlternativosVentaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductosAlternativosVentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
