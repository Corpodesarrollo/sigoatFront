import { Component, Input, SimpleChanges } from '@angular/core';
import { CarruselService } from '../../../services/carrusel.services';
import { apis } from '../../../models/apis.model';
import { ResponseModel } from '../../../models/response.model';
import { Carrusel } from '../../../models/carrusel.model';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { MainSectionComponent } from "../main-section/main-section.component";
import { DocumentosComponent } from "../documentos/documentos.component";
import { CarruselComponent } from "../carrusel/carrusel.component";

@Component({
  selector: 'app-viewer',
  standalone: true,
  imports: [CommonModule, MainSectionComponent, DocumentosComponent, CarruselComponent],
  templateUrl: './viewer.component.html',
  styleUrl: './viewer.component.css'
})
export class ViewerComponent {
  @Input() id: number | undefined = 0;

  constructor() {  
  }

  ngOnChanges(changes: SimpleChanges) {
      if (changes['id']) {
        this.id = changes['id'].currentValue;
      }
    }
}
