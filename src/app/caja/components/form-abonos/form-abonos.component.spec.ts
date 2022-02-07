import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAbonosComponent } from './form-abonos.component';

describe('FormAbonosComponent', () => {
  let component: FormAbonosComponent;
  let fixture: ComponentFixture<FormAbonosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormAbonosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormAbonosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
