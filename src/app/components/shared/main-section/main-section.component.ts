import { CommonModule } from '@angular/common';
import { Component, Input, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DialogModule } from 'primeng/dialog';
import { environment } from '../../../../environments/environment';
import { apis } from '../../../models/apis.model';
import { ResponseModel } from '../../../models/response.model';
import { AnexosService } from '../../../services/anexos.service';
import { PaginasService } from '../../../services/paginas.service';
import { NoticiasServices } from '../../../services/noticias.service';
import { PaginaNoticia } from '../../../models/paginaNoticia.model';
import { TipoNoticia } from '../../../models/tipoNoticia.model';
import { Noticias } from '../../../models/noticias.model';
import { ViewerPBIComponent } from "../viewerPBI/viewerPBI.component";

@Component({
  selector: 'app-main-section',
  standalone: true,
  imports: [CommonModule, ViewerPBIComponent, DialogModule],
  templateUrl: './main-section.component.html',
  styleUrl: './main-section.component.css',
  providers: [ConfirmationService, MessageService],
})
export class MainSectionComponent {
  @Input() id: number = 1;
  noticias: PaginaNoticia[] = [];
  ultimasNoticias: PaginaNoticia[] = [];  // posicion = 1
  informacionDestacada: PaginaNoticia[] = [];  // posicion = 2
  TipoNoticia = TipoNoticia;
  apiUrl = apis.Administrador;

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
  
  // Modal de video
  displayVideoModal = false;
  currentVideoUrl: SafeResourceUrl | null = null;
  currentVideoTitle = '';

  constructor(private messageService: MessageService, private ns: NoticiasServices, private route: ActivatedRoute, private router: Router, private sanitizer: DomSanitizer) {}
  
  ngOnChanges(changes: SimpleChanges) {
    if (changes['id']) {
      this.id = changes['id'].currentValue;
      this.ngOnInit();
    }
  }

  async ngOnInit(): Promise<void> {
    let anexo = await this.ns.PaginaNoticia("noticias", this.id, apis.Administrador);
    if (anexo) {
      let result: ResponseModel = anexo;
      if (result.error) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: result.dataError.message });
        return;
      }
      
      this.noticias = result.data;
      console.log('Noticias cargadas:', this.noticias);
      
      // Filtrar por posición: 1 = Últimas Noticias, 2 = Información Destacada
      this.ultimasNoticias = this.noticias.filter(n => n.posicion === 1);
      this.informacionDestacada = this.noticias.filter(n => n.posicion === 2);
      
      console.log('Últimas Noticias:', this.ultimasNoticias);
      console.log('Información Destacada:', this.informacionDestacada);

    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar los documentos.' });
    }
  }

  cargarUrl(id: number): string {
    return `${environment.urlMSAdministracion}NoticiasDetalles/GetImg/${id}`;
  }

  getImagenUrl(noticia: PaginaNoticia): string {
    if (noticia.imagen && noticia.imagen.file && noticia.mimeType) {
      return `data:${noticia.mimeType};base64,${noticia.imagen.file}`;
    } else if (noticia.idImagen) {
      return `${environment.urlMSAdministracion}Archivos/GetImg/${noticia.idImagen}`;
    }
    return 'https://via.placeholder.com/140x90';
  }

  getVideoEmbedUrl(urlRecurso: string | null | undefined): SafeResourceUrl | null {
    if (!urlRecurso) return null;
    // Convertir URL de YouTube a embed
    const youtubeMatch = urlRecurso.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
    if (youtubeMatch) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${youtubeMatch[1]}`);
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(urlRecurso);
  }

  getVideoThumbnail(urlRecurso: string | null | undefined): string {
    if (!urlRecurso) return 'https://via.placeholder.com/320x180?text=Video';
    // Obtener miniatura de YouTube
    const youtubeMatch = urlRecurso.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
    if (youtubeMatch) {
      return `https://img.youtube.com/vi/${youtubeMatch[1]}/mqdefault.jpg`;
    }
    return 'https://via.placeholder.com/320x180?text=Video';
  }

  abrirVideo(info: PaginaNoticia): void {
    if (info.target === '_blank') {
      // Abrir en nueva pestaña
      window.open(info.urlRecurso || '', '_blank');
    } else {
      // Abrir en modal
      this.currentVideoUrl = this.getVideoEmbedUrl(info.urlRecurso);
      this.currentVideoTitle = info.titulo || 'Video';
      this.displayVideoModal = true;
    }
  }

  cerrarVideoModal(): void {
    this.displayVideoModal = false;
    this.currentVideoUrl = null;
    this.currentVideoTitle = '';
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

  verNoticia(noticia: PaginaNoticia) {
    const url = `/portal/noticia/${this.id}/${noticia.idNoticia}`;
    if (noticia.target === '_blank') {
      window.open(url, '_blank');
    } else {
      this.router.navigate(['/portal/noticia/', this.id, noticia.idNoticia]);
    }
  }

  onImageLoad() {
    this.imageLoaded = true;
  }
}