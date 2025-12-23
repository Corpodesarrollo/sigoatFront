import { Component } from '@angular/core';
import { ModulosFrmComponent } from "../modulos-frm/modulos-frm.component";
import { Modulos } from '../../../../../models/modulos.model';
import { ActivatedRoute } from '@angular/router';
import { apis } from '../../../../../models/apis.model';
import { Menus } from '../../../../../models/menus.model';
import { ModulosService } from '../../../../../services/modulos.service';

@Component({
  selector: 'app-modulos-editar',
  standalone: true,
  imports: [ModulosFrmComponent],
  templateUrl: './modulos-editar.component.html',
  styleUrl: './modulos-editar.component.css'
})
export class ModulosEditarComponent {
  id:number | undefined;
  modulo!: Modulos;

  constructor(private route: ActivatedRoute, private ms: ModulosService) {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      this.id = idParam ? +idParam : undefined;
    });
  }

  async ngOnInit() {
    if (this.id === undefined) {
      console.error('ID del modulo no proporcionado o inválido');
      return;
    }
    
    let respose = await this.ms.getById('modulos', this.id, apis.Seguridad);
    if(respose?.error) {
      console.error('Error al obtener el modulo:', respose.error);
      return;
    } else {
      this.modulo = respose?.data as Modulos;
    }
  }
}
