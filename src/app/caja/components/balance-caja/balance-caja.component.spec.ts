import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BalanceCajaComponent } from './balance-caja.component';

describe('BalanceCajaComponent', () => {
  let component: BalanceCajaComponent;
  let fixture: ComponentFixture<BalanceCajaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BalanceCajaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BalanceCajaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
