import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { AccesibilidadComponent } from '../../../shared/accesibilidad/accesibilidad.component';
import { MainSectionComponent } from '../../../shared/main-section/main-section.component';
import { CarruselComponent } from '../../administracion/carrusel/carrusel.component';
import { DocumentosComponent } from '../../administracion/documentos/documentos.component';

@Component({
  selector: 'app-noticia',
  standalone: true,
  imports: [CommonModule, AccesibilidadComponent, CarruselComponent, DocumentosComponent, MainSectionComponent],
  templateUrl: './noticia.component.html',
  styleUrl: './noticia.component.css'
})
export class NoticiaComponent {
  id: number = 1;
  documents = [
    { id: '01', name: 'Afiliación', format: 'docx' },
    { id: '02', name: 'Certificado', format: 'pdf' }
  ];

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

  card = {
    title: 'Nuevos tratamientos para hepatitis C',
    image: 'img/portal/medicamentos.png',
    date: new Date('2023-06-15'),
    summary: 'El Ministerio de Salud anunció la llegada de 2,610 nuevos tratamientos...',
    badge: 'Nuevo',
    loaded: false,
    focusPoint: 'center top' // Punto de enfoque personalizado
  };

  currentImageIndex = 0;
  get currentImage() {
    return this.images[this.currentImageIndex];
  }

  isZoomed = false;
  isFullscreen = false;
  showOverlay = true;
  imageLoaded = false;

  ngOnInit() {
    // Carga inicial
    this.imageLoaded = false;
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
