import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormMaquinaClienteComponent } from './form-maquina-cliente.component';

describe('FormMaquinaClienteComponent', () => {
  let component: FormMaquinaClienteComponent;
  let fixture: ComponentFixture<FormMaquinaClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormMaquinaClienteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormMaquinaClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
