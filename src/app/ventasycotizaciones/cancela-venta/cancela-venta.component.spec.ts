import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelaVentaComponent } from './cancela-venta.component';

describe('CancelaVentaComponent', () => {
  let component: CancelaVentaComponent;
  let fixture: ComponentFixture<CancelaVentaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CancelaVentaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelaVentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
