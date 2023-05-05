import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductosCanceladosComponent } from './productos-cancelados.component';

describe('ProductosCanceladosComponent', () => {
  let component: ProductosCanceladosComponent;
  let fixture: ComponentFixture<ProductosCanceladosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductosCanceladosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductosCanceladosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
