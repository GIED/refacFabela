import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentasPorPedidoComponent } from './ventas-por-pedido.component';

describe('VentasPorPedidoComponent', () => {
  let component: VentasPorPedidoComponent;
  let fixture: ComponentFixture<VentasPorPedidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VentasPorPedidoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VentasPorPedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
