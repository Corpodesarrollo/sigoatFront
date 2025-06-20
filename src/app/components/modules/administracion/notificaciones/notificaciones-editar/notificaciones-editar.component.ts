import { Component } from '@angular/core';
import { NotificacionesFrmComponent } from "../notificaciones-frm/notificaciones-frm.component";
import { Notificacion } from '../../../../../models/notificaciones.model';
import { ActivatedRoute } from '@angular/router';
import { apis } from '../../../../../models/apis.model';
import { Menus } from '../../../../../models/menus.model';
import { MenuService } from '../../../../../services/menu.services';

@Component({
  selector: 'app-notificaciones-editar',
  standalone: true,
  imports: [NotificacionesFrmComponent],
  templateUrl: './notificaciones-editar.component.html',
  styleUrl: './notificaciones-editar.component.css'
})
export class NotificacionesEditarComponent {
  id:number | undefined;
  notificacion!: Notificacion;

  constructor(private route: ActivatedRoute, private ms: MenuService) {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      this.id = idParam ? +idParam : undefined;
    });
  }

  async ngOnInit() {
    if (this.id === undefined) {
      console.error('ID de la notificacion no proporcionado o inválido');
      return;
    }
    
    let respose = await this.ms.getById('notificaciones', this.id, apis.Administrador);
    if(respose?.error) {
      console.error('Error al obtener la notificacion:', respose.error);
      return;
    } else {
      this.notificacion = respose?.data as Notificacion;
    }
  }
}
