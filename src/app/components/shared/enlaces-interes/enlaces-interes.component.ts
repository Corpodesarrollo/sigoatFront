import { CommonModule } from '@angular/common';
import { Component, Input, SimpleChanges } from '@angular/core';
import { EnlaceInteres } from '../../../models/enlacesInteres.model';
import { EnlacesInteresService } from '../../../services/enlacesInteres.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { apis } from '../../../models/apis.model';
import { ResponseModel } from '../../../models/response.model';

@Component({
  selector: 'app-enlaces-interes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './enlaces-interes.component.html',
  styleUrl: './enlaces-interes.component.css',
  providers: [ConfirmationService, MessageService],
})
export class EnlacesInteresComponent {
  @Input() id: number = 1;
  enlaces: EnlaceInteres[] = [];

  constructor(
    private messageService: MessageService, 
    private enlacesService: EnlacesInteresService, 
    private route: ActivatedRoute, 
    private router: Router
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id']) {
      this.id = changes['id'].currentValue;
      this.ngOnInit();
    }
  }

  async ngOnInit(): Promise<void> {
    let enlaces = await this.enlacesService.getAllActiveById("enlacesInteres", this.id, apis.Administrador);
    if (enlaces) {
      let result: ResponseModel = enlaces;
      if (result.error) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: result.dataError.message });
        return;
      }
      
      // Ordenar enlaces por campo 'orden'
      this.enlaces = result.data.sort((a: EnlaceInteres, b: EnlaceInteres) => (a.orden || 0) - (b.orden || 0));
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los enlaces de interés.' });
    }
  }

  abrirEnlace(enlace: EnlaceInteres): void {
    if (enlace.target === '_blank' || enlace.target === 'external') {
      // Abrir en nueva ventana/pestaña (externo)
      window.open(enlace.url, '_blank');
    } else {
      // Navegar internamente dentro de SIGOATS
      if (enlace.url.startsWith('http')) {
        // Si es una URL completa pero debe abrir internamente
        window.location.href = enlace.url;
      } else {
        // Si es una ruta interna de Angular
        this.router.navigate([enlace.url]);
      }
    }
  }
}