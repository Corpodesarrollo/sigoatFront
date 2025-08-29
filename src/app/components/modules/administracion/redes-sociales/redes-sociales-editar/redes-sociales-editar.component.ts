import { Component } from '@angular/core';
import { RedesSociales } from '../../../../../models/redes-sociales';
import { ActivatedRoute } from '@angular/router';
import { apis } from '../../../../../models/apis.model';
import { Menus } from '../../../../../models/menus.model';
import { RedesSocialesService } from '../../../../../services/redesSociales.services';
import { RedesSocialesFrmComponent } from "../redes-sociales-frm/redes-sociales-frm.component";

@Component({
  selector: 'app-redes-sociales-editar',
  standalone: true,
  imports: [RedesSocialesFrmComponent],
  templateUrl: './redes-sociales-editar.component.html',
  styleUrl: './redes-sociales-editar.component.css'
})
export class RedesSocialesEditarComponent {
  id:number | undefined;
  red!: RedesSociales;

  constructor(private route: ActivatedRoute, private ms: RedesSocialesService) {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      this.id = idParam ? +idParam : undefined;
    });
  }

  async ngOnInit() {
    if (this.id === undefined) {
      console.error('ID de la red no proporcionado o inválido');
      return;
    }
    
    let respose = await this.ms.getById('menus', this.id, apis.Seguridad);
    if(respose?.error) {
      console.error('Error al obtener la red:', respose.error);
      return;
    } else {
      this.red = respose?.data as RedesSociales;
    }
  }
}
