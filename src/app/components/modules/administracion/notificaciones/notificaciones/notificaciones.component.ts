import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { Notificacion } from '../../../../../models/notificaciones.model';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthServices } from '../../../../../services/auth.service';
import { MenuService } from '../../../../../services/menu.services';
import { NotificacionesServices } from '../../../../../services/notificaciones.services';
import { User } from '../../../../../services/user.services';
import { ResponseModel } from '../../../../../models/response.model';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-notificaciones',
  standalone: true,
  imports: [DialogModule, ButtonModule, CommonModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './notificaciones.component.html',
  styleUrl: './notificaciones.component.css'
})
export class NotificacionesComponent {
  user = new User();
  mostrarDialogo: boolean = false;
  marcando: boolean = false;

  notificaciones: Notificacion[] = [];

  constructor(private auth: AuthServices, private messageService: MessageService, private mn: NotificacionesServices, private router: Router, private sanitizer: DomSanitizer) {}

  async ngOnInit() {
    let response = await this.mn.obtenerNotificaciones(Number(this.user.id ?? 0));
    if (response) {
      let result = response as ResponseModel;
      if (result.error) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: result.dataError });
        return;
      }
      
      this.notificaciones = result.data as Notificacion[];
      //el modal se despliega si hay notificaciones pendientes y esta entre la fecha de inicio y fin
      this.mostrarDialogo = this.notificaciones.some(n => !n.leido && new Date(n.fechaInicio ?? 0) <= new Date() && (!n.fechaFin || new Date(n.fechaFin) >= new Date()));
    }
  }

  get notificacionesOrdenadas(): Notificacion[] {
    if (!this.notificaciones || this.notificaciones.length === 0) {
      return [];
    }

    // Ordena: no leídas primero, luego leídas, y dentro de cada grupo por fecha descendente
    return [...this.notificaciones]
      .sort((a, b) => {
        if (a.leido !== b.leido) return Number(a.leido) - Number(b.leido); // false < true
        return new Date(b.fechaInicio ?? 0).getTime() - new Date(a.fechaInicio ?? 0).getTime(); // más recientes primero
      });
  }

  async marcarComoLeida(id: number): Promise<void> {
    this.marcando = true;
    let response = await this.mn.marcarNotificacion(id, Number(this.user.id ?? 0));
    if (response) {
      let result = response as ResponseModel;
      if (result.error) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: result.dataError });
        return;
      }
      
      this.notificaciones = result.data as Notificacion[];
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las notificaciones.' });
    }
    this.marcando = false;
  }

  get cantidadNoLeidas(): number {
    return this.notificaciones.filter(n => !n.leido).length;
  }

  sanitizarHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
