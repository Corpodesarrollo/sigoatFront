import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolesFrmComponent } from './roles-frm.component';

describe('RolesFrmComponent', () => {
  let component: RolesFrmComponent;
  let fixture: ComponentFixture<RolesFrmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RolesFrmComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RolesFrmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
