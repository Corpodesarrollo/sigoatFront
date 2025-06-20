import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablerosCrearComponent } from './tableros-crear.component';

describe('TablerosCrearComponent', () => {
  let component: TablerosCrearComponent;
  let fixture: ComponentFixture<TablerosCrearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablerosCrearComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablerosCrearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
