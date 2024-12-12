import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarritoPedidoComponent } from './carrito-pedido.component';

describe('CarritoPedidoComponent', () => {
  let component: CarritoPedidoComponent;
  let fixture: ComponentFixture<CarritoPedidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarritoPedidoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CarritoPedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
