import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificacionesConsultarComponent } from './notificaciones-consultar.component';

describe('NotificacionesConsultarComponent', () => {
  let component: NotificacionesConsultarComponent;
  let fixture: ComponentFixture<NotificacionesConsultarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificacionesConsultarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificacionesConsultarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
