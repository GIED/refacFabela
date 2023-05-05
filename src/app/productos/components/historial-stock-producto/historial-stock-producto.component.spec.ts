import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialStockProductoComponent } from './historial-stock-producto.component';

describe('HistorialStockProductoComponent', () => {
  let component: HistorialStockProductoComponent;
  let fixture: ComponentFixture<HistorialStockProductoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistorialStockProductoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistorialStockProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
