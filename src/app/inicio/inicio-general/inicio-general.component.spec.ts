import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InicioGeneralComponent } from './inicio-general.component';

describe('InicioGeneralComponent', () => {
  let component: InicioGeneralComponent;
  let fixture: ComponentFixture<InicioGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InicioGeneralComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InicioGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
