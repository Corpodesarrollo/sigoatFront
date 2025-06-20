import { CommonModule } from '@angular/common';
import { Component, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-accesibilidad',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './accesibilidad.component.html',
  styleUrl: './accesibilidad.component.css'
})
export class AccesibilidadComponent {
  visible = false;

  togglePanel() {
    this.visible = !this.visible;
  }

  toggleContraste() {
    document.body.classList.toggle('contraste');
  }

  resaltarEnlaces() {
    document.body.classList.toggle('resaltar-enlaces');
  }

  agrandarTexto() {
    document.body.classList.toggle('texto-grande');
  }

  ajustarEspaciadoTexto() {
    document.body.classList.toggle('espaciado-texto');
  }

  detenerAnimaciones() {
    document.body.classList.toggle('detener-animaciones');
  }

  ocultarImagenes() {
    document.body.classList.toggle('ocultar-imagenes');
  }

  modoDislexia() {
    document.body.classList.toggle('fuente-dislexia');
  }

  activarCursor() {
    document.body.classList.toggle('cursor-grande');
  }

  mostrarInformacion() {
    alert('Este panel brinda opciones de accesibilidad visual para el sitio.');
  }

  ajustarAlturaLinea() {
    document.body.classList.toggle('linea-alta');
  }

  alinearTexto() {
    document.body.classList.toggle('texto-justificado');
  }

  ajustarSaturacion() {
    document.body.classList.toggle('saturacion-baja');
  }
}
