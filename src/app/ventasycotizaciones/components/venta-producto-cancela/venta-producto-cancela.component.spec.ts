import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentaProductoCancelaComponent } from './venta-producto-cancela.component';

describe('VentaProductoCancelaComponent', () => {
  let component: VentaProductoCancelaComponent;
  let fixture: ComponentFixture<VentaProductoCancelaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VentaProductoCancelaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VentaProductoCancelaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
