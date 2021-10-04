import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntregaDeMercanciaComponent } from './entrega-de-mercancia.component';

describe('EntregaDeMercanciaComponent', () => {
  let component: EntregaDeMercanciaComponent;
  let fixture: ComponentFixture<EntregaDeMercanciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntregaDeMercanciaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EntregaDeMercanciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
