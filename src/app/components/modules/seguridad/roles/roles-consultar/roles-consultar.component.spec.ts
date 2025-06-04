import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolesConsultarComponent } from './roles-consultar.component';

describe('RolesConsultarComponent', () => {
  let component: RolesConsultarComponent;
  let fixture: ComponentFixture<RolesConsultarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RolesConsultarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RolesConsultarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
