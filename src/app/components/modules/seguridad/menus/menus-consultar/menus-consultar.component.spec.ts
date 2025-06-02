import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenusConsultarComponent } from './menus-consultar.component';

describe('MenusConsultarComponent', () => {
  let component: MenusConsultarComponent;
  let fixture: ComponentFixture<MenusConsultarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenusConsultarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenusConsultarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
