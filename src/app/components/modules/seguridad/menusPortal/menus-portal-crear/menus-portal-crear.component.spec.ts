import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenusPortalCrearComponent } from './menus-portal-crear.component';

describe('MenusPortalCrearComponent', () => {
  let component: MenusPortalCrearComponent;
  let fixture: ComponentFixture<MenusPortalCrearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenusPortalCrearComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenusPortalCrearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
