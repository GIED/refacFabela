import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroPedidosComponent } from './registro-pedidos.component';

describe('RegistroPedidosComponent', () => {
  let component: RegistroPedidosComponent;
  let fixture: ComponentFixture<RegistroPedidosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistroPedidosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroPedidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
