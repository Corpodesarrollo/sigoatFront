import { Component, Input, SimpleChanges } from '@angular/core';
import { apis } from '../../../models/apis.model';
import { ResponseModel } from '../../../models/response.model';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { environment } from '../../../../environments/environment';
import { PaginaNoticia } from '../../../models/paginaNoticia.model';
import { TipoNoticia } from '../../../models/tipoNoticia.model';
import { NoticiasServices } from '../../../services/noticias.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ViewerPBIComponent } from "../viewerPBI/viewerPBI.component";

@Component({
  selector: 'app-notice-section',
  standalone: true,
  imports: [CommonModule, ViewerPBIComponent, DialogModule],
  templateUrl: './notice-section.component.html',
  styleUrl: './notice-section.component.css',
  providers: [ConfirmationService, MessageService],
})
export class NoticeSectionComponent {
  @Input() id: number = 0;
  @Input() idPagina: number = 0;
  noticias: PaginaNoticia[] = [];
  noticia?: PaginaNoticia;
  informacionDestacada: PaginaNoticia[] = [];  // posicion = 2
  TipoNoticia = TipoNoticia;
  
  // Modal de video
  displayVideoModal = false;
  currentVideoUrl: SafeResourceUrl | null = null;
  currentVideoTitle = '';

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
      
      // Cargar información destacada
      await this.cargarInformacionDestacada();
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

  async cargarInformacionDestacada(): Promise<void> {
    if (!this.idPagina) return;
    
    let response = await this.ns.PaginaNoticia("noticias", this.idPagina, apis.Administrador);
    if (response && !response.error) {
      const todasNoticias = response.data as PaginaNoticia[];
      // Filtrar solo información destacada (posicion = 2) y excluir la noticia actual
      this.informacionDestacada = todasNoticias.filter(
        n => n.posicion === 2 && n.idNoticia !== this.id
      ).slice(0, 5); // Mostrar máximo 5
    }
  }

  getImagenUrl(noticia: PaginaNoticia): string {
    if (noticia.imagen && noticia.imagen.file && noticia.mimeType) {
      return `data:${noticia.mimeType};base64,${noticia.imagen.file}`;
    } else if (noticia.idImagen) {
      return `${environment.urlMSAdministracion}Archivos/GetImg/${noticia.idImagen}`;
    }
    return 'https://via.placeholder.com/140x90';
  }

  getVideoThumbnail(urlRecurso: string | null | undefined): string {
    if (!urlRecurso) return 'https://via.placeholder.com/320x180?text=Video';
    const youtubeMatch = urlRecurso.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
    if (youtubeMatch) {
      return `https://img.youtube.com/vi/${youtubeMatch[1]}/mqdefault.jpg`;
    }
    return 'https://via.placeholder.com/320x180?text=Video';
  }

  getVideoEmbedUrl(urlRecurso: string | null | undefined): SafeResourceUrl | null {
    if (!urlRecurso) return null;
    const youtubeMatch = urlRecurso.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
    if (youtubeMatch) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${youtubeMatch[1]}`);
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(urlRecurso);
  }

  abrirVideo(info: PaginaNoticia): void {
    if (info.target === '_blank') {
      window.open(info.urlRecurso || '', '_blank');
    } else {
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

  verNoticia(id: number | undefined) {
    this.router.navigate(['/portal/noticia/', this.idPagina, id]);
  }
}
