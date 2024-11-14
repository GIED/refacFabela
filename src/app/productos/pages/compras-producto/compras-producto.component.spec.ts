import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprasProductoComponent } from './compras-producto.component';

describe('ComprasProductoComponent', () => {
  let component: ComprasProductoComponent;
  let fixture: ComponentFixture<ComprasProductoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComprasProductoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComprasProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
