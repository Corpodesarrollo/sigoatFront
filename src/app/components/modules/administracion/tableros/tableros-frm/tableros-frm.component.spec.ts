import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablerosFrmComponent } from './tableros-frm.component';

describe('TablerosFrmComponent', () => {
  let component: TablerosFrmComponent;
  let fixture: ComponentFixture<TablerosFrmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablerosFrmComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablerosFrmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
