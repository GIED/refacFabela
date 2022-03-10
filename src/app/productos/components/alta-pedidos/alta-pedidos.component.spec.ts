import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AltaPedidosComponent } from './alta-pedidos.component';

describe('AltaPedidosComponent', () => {
  let component: AltaPedidosComponent;
  let fixture: ComponentFixture<AltaPedidosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AltaPedidosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AltaPedidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
