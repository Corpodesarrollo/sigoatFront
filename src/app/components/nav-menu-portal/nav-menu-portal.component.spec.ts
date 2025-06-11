import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavMenuPortalComponent } from './nav-menu-portal.component';

describe('NavMenuPortalComponent', () => {
  let component: NavMenuPortalComponent;
  let fixture: ComponentFixture<NavMenuPortalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavMenuPortalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavMenuPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
