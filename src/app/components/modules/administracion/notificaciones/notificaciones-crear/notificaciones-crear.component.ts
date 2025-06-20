import { Component } from '@angular/core';
import { NotificacionesFrmComponent } from "../notificaciones-frm/notificaciones-frm.component";

@Component({
  selector: 'app-notificaciones-crear',
  standalone: true,
  imports: [NotificacionesFrmComponent],
  templateUrl: './notificaciones-crear.component.html',
  styleUrl: './notificaciones-crear.component.css'
})
export class NotificacionesCrearComponent {

}
