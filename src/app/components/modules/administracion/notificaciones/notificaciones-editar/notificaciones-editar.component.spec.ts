import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificacionesEditarComponent } from './notificaciones-editar.component';

describe('NotificacionesEditarComponent', () => {
  let component: NotificacionesEditarComponent;
  let fixture: ComponentFixture<NotificacionesEditarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificacionesEditarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificacionesEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
