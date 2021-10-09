import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlternativosProductoComponent } from './alternativos-producto.component';

describe('AlternativosProductoComponent', () => {
  let component: AlternativosProductoComponent;
  let fixture: ComponentFixture<AlternativosProductoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlternativosProductoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlternativosProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
