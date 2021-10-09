import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialProductoComponent } from './historial-producto.component';

describe('HistorialProductoComponent', () => {
  let component: HistorialProductoComponent;
  let fixture: ComponentFixture<HistorialProductoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistorialProductoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistorialProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
