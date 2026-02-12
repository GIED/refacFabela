import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutorizacionInventarioComponent } from './autorizacion-inventario.component';

describe('AutorizacionInventarioComponent', () => {
  let component: AutorizacionInventarioComponent;
  let fixture: ComponentFixture<AutorizacionInventarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutorizacionInventarioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutorizacionInventarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
