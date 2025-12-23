import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { AccesibilidadComponent } from "../../../shared/accesibilidad/accesibilidad.component";
import { CarruselComponent } from '../../../shared/carrusel/carrusel.component';
import { DocumentosComponent } from "../../../shared/documentos/documentos.component";
import { MainSectionComponent } from "../../../shared/main-section/main-section.component";
import { ActivatedRoute } from '@angular/router';
import { ViewerRedesSocialesComponent } from "../../../shared/viewerRedesSociales/viewerRedesSociales.component";
import { PaginasService } from '../../../../services/paginas.service';
import { Paginas } from '../../../../models/paginas.model';
import { apis } from '../../../../models/apis.model';
import { EnMantenimientoComponent } from "../../administracion/en-mantenimiento/en-mantenimiento.component";

@Component({
  selector: 'app-paginas',
  standalone: true,
  imports: [CommonModule, AccesibilidadComponent, CarruselComponent, DocumentosComponent, MainSectionComponent, ViewerRedesSocialesComponent, EnMantenimientoComponent],
  templateUrl: './paginas.component.html',
  styleUrl: './paginas.component.css'
})
export class PaginasComponent {
  id: number = 1;
  documents = [];
  images = [];

  card = {};

  currentImageIndex = 0;
  get currentImage() {
    return this.images[this.currentImageIndex];
  }

  isZoomed = false;
  isFullscreen = false;
  showOverlay = true;
  imageLoaded = false;
  enMantenimiento = false;

  constructor(private route: ActivatedRoute, private paginasService: PaginasService) {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      this.id = idParam ? +idParam : 1;
    });
  }

  async ngOnInit() {
    let response = await this.paginasService.getById("paginas", this.id, apis.Administrador);
    if (response && response.ok) {
      let pagina = response.data as Paginas;
      this.enMantenimiento = !pagina.estado;
    }
  }

  changeImage(index: number) {
    this.currentImageIndex = index;
    this.imageLoaded = false;
    this.isZoomed = false;
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

  toggleOverlay() {
    this.showOverlay = !this.showOverlay;
  }

  onImageLoad() {
    this.imageLoaded = true;
  }

  @HostListener('document:fullscreenchange', ['$event'])
  onFullscreenChange(event: Event) {
    this.isFullscreen = !!document.fullscreenElement;
  }


  downloadDocument(document: any) {
    // Implement download logic here
    console.log('Downloading:', document.name);
    // You would typically call a service here to handle the download
  }
}
