import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleAbonosCreditoComponent } from './detalle-abonos-credito.component';

describe('DetalleAbonosCreditoComponent', () => {
  let component: DetalleAbonosCreditoComponent;
  let fixture: ComponentFixture<DetalleAbonosCreditoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleAbonosCreditoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleAbonosCreditoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
