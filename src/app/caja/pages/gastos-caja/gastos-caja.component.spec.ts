import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GastosCajaComponent } from './gastos-caja.component';

describe('GastosCajaComponent', () => {
  let component: GastosCajaComponent;
  let fixture: ComponentFixture<GastosCajaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GastosCajaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GastosCajaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
