import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenusEditarComponent } from './menus-editar.component';

describe('MenusEditarComponent', () => {
  let component: MenusEditarComponent;
  let fixture: ComponentFixture<MenusEditarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenusEditarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenusEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
