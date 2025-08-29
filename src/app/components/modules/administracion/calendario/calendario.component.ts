import {Component, OnInit,ViewEncapsulation, AfterViewChecked, AfterViewInit} from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { HttpClient } from '@angular/common/http';
import { InteractionRequiredAuthError } from '@azure/msal-browser';
import { GraphEvent } from '../../../../models/graph-event.model';
import { CalendarService } from '../../../../services/calendario.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-material-calendar',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CalendarioComponent implements OnInit, AfterViewChecked  {
  eventosPorFecha: { [key: string]: GraphEvent[] } = {};
  fechaSeleccionada: Date | null = null;
  mesActivo: Date = new Date();

  constructor(
    private calendarService: CalendarService,
    private msalService: MsalService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef 

    
  ) {}

  async ngOnInit(): Promise<void> {
    const cuentas = this.msalService.instance.getAllAccounts();

    if (cuentas.length === 0) {
      this.msalService.loginRedirect({
        scopes: [
          'https://graph.microsoft.com/Calendars.Read',
          'openid',
          'profile',
          'offline_access'
        ]
      });
      return;
    }

    const cuentaActiva = this.msalService.instance.getActiveAccount() ?? cuentas[0];
    this.msalService.instance.setActiveAccount(cuentaActiva);

    try {
      const token = await this.msalService.instance.acquireTokenSilent({
        scopes: [
          'https://graph.microsoft.com/Calendars.Read',
          'openid',
          'profile',
          'offline_access'
        ],
        account: cuentaActiva
      });

      console.log('✅ Token adquirido:', token.accessToken);
      this.llamarGraphConToken(token.accessToken);
    } catch (error: any) {
      if (error instanceof InteractionRequiredAuthError) {
        console.warn('🔄 Redirigiendo para login interactivo...');
        this.msalService.loginRedirect({
          scopes: [
            'https://graph.microsoft.com/Calendars.Read',
            'openid',
            'profile',
            'offline_access'
          ]
        });
      } else {
        console.error('❌ Error inesperado:', error);
      }
    }
  }

  llamarGraphConToken(token: string): void {
    this.http.get<any>('https://graph.microsoft.com/v1.0/me/events', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).subscribe({
      next: (respuesta) => {
        console.log('📥 Eventos recibidos de Graph:', respuesta);
        this.organizarEventosPorFecha(respuesta.value);
      },
      error: (error) => {
        console.error('❌ Error al llamar a Graph:', error);
      }
    });
  }

organizarEventosPorFecha(eventos: GraphEvent[]): void {
  this.eventosPorFecha = {};
  for (const evento of eventos) {
    const fecha = evento.start?.dateTime?.split('T')[0];
    if (fecha) {
      if (!this.eventosPorFecha[fecha]) {
        this.eventosPorFecha[fecha] = [];
      }
      this.eventosPorFecha[fecha].push(evento);
    }
  }

  setTimeout(() => this.resaltarDiasConEventos(), 0);
}

  getEventosDeFecha(fecha: Date): GraphEvent[] {
    const key = fecha.toISOString().split('T')[0];
    return this.eventosPorFecha[key] || [];
  }

  seleccionarFecha(fecha: Date): void {
    this.fechaSeleccionada = fecha;
    this.mesActivo = new Date(fecha.getFullYear(), fecha.getMonth(), 1); 
        
  }

  getEventosDelMes(fechaBase: Date): GraphEvent[] {
    const eventosDelMes: GraphEvent[] = [];

    const mes = fechaBase.getMonth();
    const anio = fechaBase.getFullYear();

    for (const key in this.eventosPorFecha) {
      const fecha = new Date(key);
      if (fecha.getMonth() === mes && fecha.getFullYear() === anio) {
        eventosDelMes.push(...this.eventosPorFecha[key]);
      }
    }

    return eventosDelMes;
  }



  tieneEventos(fecha: Date): boolean {
    const key = fecha.toISOString().split('T')[0];
    return this.eventosPorFecha[key]?.length > 0;
  }

  ngAfterViewChecked(): void {
    this.resaltarDiasConEventos();
  }

resaltarDiasConEventos(): void {
  const celdas = document.querySelectorAll('.p-datepicker-calendar td');

  celdas.forEach((celda: any) => {
    const span = celda.querySelector('span');
    if (!span || isNaN(+span.textContent)) return;

    const dia = span.textContent.padStart(2, '0');
    const mes = (this.mesActivo.getMonth() + 1).toString().padStart(2, '0');
    const anio = this.mesActivo.getFullYear();
    const key = `${anio}-${mes}-${dia}`;

    span.classList.remove('fecha-con-evento');

    if (this.eventosPorFecha[key]) {
      span.classList.add('fecha-con-evento'); 
    }
  });
}

cambiarMes(event: { month?: number; year?: number }): void {
  if (event.month !== undefined && event.year !== undefined) {
    this.mesActivo = new Date(event.year, event.month, 1);
    this.cdr.detectChanges(); 
  }
}
}