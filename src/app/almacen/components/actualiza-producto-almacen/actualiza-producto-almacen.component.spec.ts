import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualizaProductoAlmacenComponent } from './actualiza-producto-almacen.component';

describe('ActualizaProductoAlmacenComponent', () => {
  let component: ActualizaProductoAlmacenComponent;
  let fixture: ComponentFixture<ActualizaProductoAlmacenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActualizaProductoAlmacenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActualizaProductoAlmacenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
