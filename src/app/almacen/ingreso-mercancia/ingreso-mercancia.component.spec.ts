import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngresoMercanciaComponent } from './ingreso-mercancia.component';

describe('IngresoMercanciaComponent', () => {
  let component: IngresoMercanciaComponent;
  let fixture: ComponentFixture<IngresoMercanciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IngresoMercanciaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IngresoMercanciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
