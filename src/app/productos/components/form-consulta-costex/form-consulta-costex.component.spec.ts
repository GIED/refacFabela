import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormConsultaCostexComponent } from './form-consulta-costex.component';

describe('FormConsultaCostexComponent', () => {
  let component: FormConsultaCostexComponent;
  let fixture: ComponentFixture<FormConsultaCostexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormConsultaCostexComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormConsultaCostexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
