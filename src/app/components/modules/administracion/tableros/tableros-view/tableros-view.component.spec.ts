import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablerosViewComponent } from './tableros-view.component';

describe('TablerosViewComponent', () => {
  let component: TablerosViewComponent;
  let fixture: ComponentFixture<TablerosViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablerosViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablerosViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
