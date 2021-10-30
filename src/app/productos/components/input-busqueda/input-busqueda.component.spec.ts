import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputBusquedaComponent } from './input-busqueda.component';

describe('InputBusquedaComponent', () => {
  let component: InputBusquedaComponent;
  let fixture: ComponentFixture<InputBusquedaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputBusquedaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputBusquedaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
