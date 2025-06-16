import { Injectable } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { HttpClient } from '@angular/common/http';
import { from, switchMap, throwError } from 'rxjs';
import { GraphEvent } from '../models/graph-event.model';

@Injectable({ providedIn: 'root' })
export class CalendarService {
  constructor(private msalService: MsalService, private http: HttpClient) {}

  getEventos() {
    const cuenta = this.msalService.instance.getActiveAccount();

    if (!cuenta && this.msalService.instance.getAllAccounts().length > 0) {
      this.msalService.instance.setActiveAccount(this.msalService.instance.getAllAccounts()[0]);
    }

    const cuentaActiva = this.msalService.instance.getActiveAccount();
    if (!cuentaActiva) {
      return throwError(() => new Error('Usuario no autenticado.'));
    }

    return from(this.msalService.instance.acquireTokenSilent({
      account: cuentaActiva,
      scopes: ['https://graph.microsoft.com/Calendars.Read']
    })).pipe(
      switchMap(result => {
        // 🔍 Mostrar el token en consola (SOLO PARA DESARROLLO)
        console.log('🟢 Token de acceso:', result.accessToken);

        // Luego puedes hacer tu petición al backend
        return this.http.get<GraphEvent[]>('/api/calendario/eventos', {
          headers: {
            Authorization: `Bearer ${result.accessToken}`
          }
        });
      })
    );
  }
}