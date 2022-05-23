import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentaStockCeroComponent } from './venta-stock-cero.component';

describe('VentaStockCeroComponent', () => {
  let component: VentaStockCeroComponent;
  let fixture: ComponentFixture<VentaStockCeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VentaStockCeroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VentaStockCeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
