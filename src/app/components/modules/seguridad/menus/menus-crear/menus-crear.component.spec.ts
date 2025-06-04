import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenusCrearComponent } from './menus-crear.component';

describe('MenusCrearComponent', () => {
  let component: MenusCrearComponent;
  let fixture: ComponentFixture<MenusCrearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenusCrearComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenusCrearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
