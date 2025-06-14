import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenusPortalConsultarComponent } from './menus-portal-consultar.component';

describe('MenusPortalConsultarComponent', () => {
  let component: MenusPortalConsultarComponent;
  let fixture: ComponentFixture<MenusPortalConsultarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenusPortalConsultarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenusPortalConsultarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
