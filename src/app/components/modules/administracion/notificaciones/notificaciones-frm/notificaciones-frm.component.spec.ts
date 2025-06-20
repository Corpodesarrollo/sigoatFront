import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificacionesFrmComponent } from './notificaciones-frm.component';

describe('NotificacionesFrmComponent', () => {
  let component: NotificacionesFrmComponent;
  let fixture: ComponentFixture<NotificacionesFrmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificacionesFrmComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificacionesFrmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
