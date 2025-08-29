import { Component, Input, SimpleChanges } from '@angular/core';
import { apis } from '../../../models/apis.model';
import { ResponseModel } from '../../../models/response.model';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { environment } from '../../../../environments/environment';
import { PaginaNoticia } from '../../../models/paginaNoticia.model';
import { TipoNoticia } from '../../../models/tipoNoticia.model';
import { NoticiasServices } from '../../../services/noticias.services';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-notice-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notice-section.component.html',
  styleUrl: './notice-section.component.css',
  providers: [ConfirmationService, MessageService],
})
export class NoticeSectionComponent {
  @Input() id: number = 0;
  noticias: PaginaNoticia[] = [];
  noticia?: PaginaNoticia;
  TipoNoticia = TipoNoticia;

  images = [
    {
      url: 'img/portal/medicamentos.png',
      alt: 'Imagen de muestra 1',
      title: 'Título de la imagen 1',
      description: 'Descripción detallada de la primera imagen'
    },
    // Puedes agregar más imágenes si necesitas
    {
      url: 'img/portal/medicamentos.png',
      alt: 'Imagen de muestra 2',
      title: 'Título de la imagen 2',
      description: 'Descripción detallada de la segunda imagen'
    }
  ];

  isZoomed = false;
  isFullscreen = false;
  showOverlay = true;
  imageLoaded = false;

  constructor(private messageService: MessageService, private ns: NoticiasServices, private route: ActivatedRoute, private router: Router, private sanitizer: DomSanitizer) {}
  
  ngOnChanges(changes: SimpleChanges) {
    if (changes['id']) {
      this.id = changes['id'].currentValue;
      this.ngOnInit();
    }
  }

  async ngOnInit(): Promise<void> {
    console.log("Cargando noticias para la sección con ID:", this.id);
    let anexo = await this.ns.Noticia("noticias", this.id, apis.Administrador);
    if (anexo) {
      let result: ResponseModel = anexo;
      if (result.error) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: result.dataError.message });
        return;
      }
      
      this.noticia = result.data;
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar los documentos.' });
    }
  }

  cargarUrl(id: number): string {
    return `${environment.urlMSAdministracion}NoticiasDetalles/GetImg/${id}`;
  }

  descargar(id: number): void {
    window.open(`${environment.urlMSAdministracion}Anexos/GetDoc/${id}`, '_blank');
  }

  toggleZoom() {
    this.isZoomed = !this.isZoomed;
  }

  toggleFullscreen() {
    this.isFullscreen = !this.isFullscreen;
    if (this.isFullscreen) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error al intentar pantalla completa: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  }

  onImageLoad() {
    this.imageLoaded = true;
  }

  sanitizarURL(url: string): SafeResourceUrl {
    // Reemplaza el link de YouTube normal por el formato embebido
    const embedUrl = url.replace('watch?v=', 'embed/');
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }
}
