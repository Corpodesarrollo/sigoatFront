import { CommonModule } from '@angular/common';
import { Component, Input, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { environment } from '../../../../environments/environment';
import { apis } from '../../../models/apis.model';
import { ResponseModel } from '../../../models/response.model';
import { AnexosService } from '../../../services/anexoss.services';
import { PaginasService } from '../../../services/paginas.services';
import { NoticiasServices } from '../../../services/noticias.services';
import { PaginaNoticia } from '../../../models/paginaNoticia.model';
import { TipoNoticia } from '../../../models/tipoNoticia.model';
import { Noticias } from '../../../models/noticias.model';

@Component({
  selector: 'app-main-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './main-section.component.html',
  styleUrl: './main-section.component.css',
  providers: [ConfirmationService, MessageService],
})
export class MainSectionComponent {
  @Input() id: number = 1;
  noticias: PaginaNoticia[] = [];
  noticia1?: PaginaNoticia;
  noticia2?: PaginaNoticia;
  noticia3?: PaginaNoticia;
  noticia4?: PaginaNoticia;
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

  constructor(private messageService: MessageService, private ns: NoticiasServices, private route: ActivatedRoute, private router: Router) {}
  
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
      if (this.noticias.length > 0) {
        console.log('Noticias1:', this.noticias[0]);
        this.noticia1 = this.noticias[0];
      }
      if (this.noticias.length > 1) {
        console.log('Noticias2:', this.noticias[1]);
        this.noticia2 = this.noticias[1];
      }
      if (this.noticias.length > 2) {
        console.log('Noticias3:', this.noticias[2]);
        this.noticia3 = this.noticias[2];
      }
      if (this.noticias.length > 3) {
        console.log('Noticias4:', this.noticias[3]);
        this.noticia4 = this.noticias[3];
      }

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

  noticia(id: number | undefined) {
    this.router.navigate(['/noticia/', this.id, id]);
  }

  onImageLoad() {
    this.imageLoaded = true;
  }
}