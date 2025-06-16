import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenusPortalEditarComponent } from './menus-portal-editar.component';

describe('MenusPortalEditarComponent', () => {
  let component: MenusPortalEditarComponent;
  let fixture: ComponentFixture<MenusPortalEditarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenusPortalEditarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenusPortalEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
