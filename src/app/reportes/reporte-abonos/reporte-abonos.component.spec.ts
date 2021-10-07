import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteAbonosComponent } from './reporte-abonos.component';

describe('ReporteAbonosComponent', () => {
  let component: ReporteAbonosComponent;
  let fixture: ComponentFixture<ReporteAbonosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteAbonosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteAbonosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
