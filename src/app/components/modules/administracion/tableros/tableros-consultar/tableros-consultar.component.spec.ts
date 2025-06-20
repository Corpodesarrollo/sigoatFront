import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablerosConsultarComponent } from './tableros-consultar.component';

describe('TablerosConsultarComponent', () => {
  let component: TablerosConsultarComponent;
  let fixture: ComponentFixture<TablerosConsultarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablerosConsultarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablerosConsultarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
