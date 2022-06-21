import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaquinaClienteComponent } from './maquina-cliente.component';

describe('MaquinaClienteComponent', () => {
  let component: MaquinaClienteComponent;
  let fixture: ComponentFixture<MaquinaClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaquinaClienteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaquinaClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
