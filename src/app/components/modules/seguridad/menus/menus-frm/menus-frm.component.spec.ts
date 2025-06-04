import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenusFrmComponent } from './menus-frm.component';

describe('MenusFrmComponent', () => {
  let component: MenusFrmComponent;
  let fixture: ComponentFixture<MenusFrmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenusFrmComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenusFrmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
