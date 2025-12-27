import { Component, Input, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RedesSociales } from '../../../models/redes-sociales.model';
import { SafeResourceUrl } from '@angular/platform-browser';
import { RedesSocialesService } from '../../../services/redesSociales.service';
import { environment } from '../../../../environments/environment';
import { redesSociales } from '../../../models/redesSociales';

@Component({
  selector: 'app-viewerRedesSociales',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './viewerRedesSociales.component.html',
  styleUrl: './viewerRedesSociales.component.css'
})
export class ViewerRedesSocialesComponent {
  redes: RedesSociales[] = [];
  urlSafe!: SafeResourceUrl;

  constructor(private rs: RedesSocialesService) {  
  }

  ngOnInit(): void {
    this.redes = this.redes || [];
    this.rs.getList().then(data => {
      this.redes = data as RedesSociales[];
    }).catch(err => {
      console.error('Error al cargar las redes sociales:', err);
    });
  }

  ngOnChanges(changes: SimpleChanges) {
      if (changes['redes']) {
        this.redes = changes['redes'].currentValue;
      }
    }

  cargarUrl(id: number | null): string {
    return `${environment.urlMSAdministracion}RedesSociales/GetImg/${id ?? 0}`;
  }

  cargarData(arg0: number): string {
    const redSocial = redesSociales.find((item: { id: number; }) => item.id === arg0);
    return redSocial ? redSocial.nombre.toLowerCase() : '';
  }
}
