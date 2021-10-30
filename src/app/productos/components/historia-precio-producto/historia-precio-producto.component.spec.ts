import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriaPrecioProductoComponent } from './historia-precio-producto.component';

describe('HistoriaPrecioProductoComponent', () => {
  let component: HistoriaPrecioProductoComponent;
  let fixture: ComponentFixture<HistoriaPrecioProductoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoriaPrecioProductoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoriaPrecioProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
