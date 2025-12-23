import { Component, Input, SimpleChanges } from '@angular/core';
import { CarruselService } from '../../../services/carrusel.service';
import { apis } from '../../../models/apis.model';
import { ResponseModel } from '../../../models/response.model';
import { Carrusel } from '../../../models/carrusel.model';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-carrusel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrusel.component.html',
  styleUrl: './carrusel.component.css'
})
export class CarruselComponent {
  @Input() id: number = 0;
  carrusel: Carrusel[] = [];

  constructor(private carruselService: CarruselService) {  
  }

  ngOnChanges(changes: SimpleChanges) {
      if (changes['id']) {
        this.id = changes['id'].currentValue;
        this.ngOnInit();
      }
    }

  async ngOnInit() {
    let carrusel = await this.carruselService.getAllById("imagenes", this.id, apis.Administrador);
    let result = carrusel as ResponseModel;
    if (result.error) {
      console.error('Error al obtener las imágenes del carrusel:', result.dataError);
    } else {
      this.carrusel = result.data as Carrusel[];
      // Aquí puedes manejar las imágenes obtenidas
      console.log('Imágenes del carrusel:', result.data);
    }
  }

  cargarUrl(id: number): string {
    return `${environment.urlMSAdministracion}Imagenes/GetImg/${id}`;
  }
}
