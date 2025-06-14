import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenusPortalFrmComponent } from './menus-portal-frm.component';

describe('MenusPortalFrmComponent', () => {
  let component: MenusPortalFrmComponent;
  let fixture: ComponentFixture<MenusPortalFrmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenusPortalFrmComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenusPortalFrmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
