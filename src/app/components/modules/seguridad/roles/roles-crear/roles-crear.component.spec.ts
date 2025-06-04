import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolesCrearComponent } from './roles-crear.component';

describe('RolesCrearComponent', () => {
  let component: RolesCrearComponent;
  let fixture: ComponentFixture<RolesCrearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RolesCrearComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RolesCrearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
