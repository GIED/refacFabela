import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FechaRangoComponent } from './fecha-rango.component';

describe('FechaRangoComponent', () => {
  let component: FechaRangoComponent;
  let fixture: ComponentFixture<FechaRangoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FechaRangoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FechaRangoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
