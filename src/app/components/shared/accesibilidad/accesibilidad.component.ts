import { Component, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-accesibilidad',
  standalone: true,
  imports: [],
  templateUrl: './accesibilidad.component.html',
  styleUrl: './accesibilidad.component.css'
})
export class AccesibilidadComponent {
  constructor(private renderer: Renderer2) {}

  toggleClass(className: string) {
    document.body.classList.toggle(className);
  }

  toggleContrast() {
    this.toggleClass('high-contrast');
  }

  highlightLinks() {
    document.querySelectorAll('a').forEach(link => {
      (link as HTMLElement).style.backgroundColor = 'yellow';
    });
  }

  increaseText() {
    this.toggleClass('large-text');
  }

  adjustLetterSpacing() {
    this.toggleClass('spacing');
  }

  stopAnimations() {
    const style = this.renderer.createElement('style');
    style.innerText = `* { animation: none !important; transition: none !important; }`;
    this.renderer.appendChild(document.head, style);
  }

  hideImages() {
    document.querySelectorAll('img').forEach(img => {
      (img as HTMLElement).style.display = 'none';
    });
  }

  toggleDyslexiaFont() {
    this.toggleClass('dyslexia-font');
  }

  changeCursor() {
    document.body.style.cursor = 'url(assets/cursor.cur), auto'; // Personaliza este cursor si quieres
  }

  showInfo() {
    alert("Este sitio incluye opciones de accesibilidad para mejorar la experiencia del usuario.");
  }

  adjustLineHeight() {
    this.toggleClass('line-height');
  }

  alignText() {
    document.body.style.textAlign = 
      document.body.style.textAlign === 'justify' ? 'left' : 'justify';
  }

  adjustSaturation() {
    const currentFilter = document.body.style.filter;
    document.body.style.filter = currentFilter === 'grayscale(100%)' ? 'none' : 'grayscale(100%)';
  }
}
