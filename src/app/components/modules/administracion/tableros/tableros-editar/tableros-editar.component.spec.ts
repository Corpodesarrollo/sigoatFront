import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablerosEditarComponent } from './tableros-editar.component';

describe('TablerosEditarComponent', () => {
  let component: TablerosEditarComponent;
  let fixture: ComponentFixture<TablerosEditarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablerosEditarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablerosEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
