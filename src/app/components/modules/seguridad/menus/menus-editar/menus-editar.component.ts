import { Component } from '@angular/core';
import { MenusFrmComponent } from "../menus-frm/menus-frm.component";
import { ActivatedRoute } from '@angular/router';
import { MenuService } from '../../../../../services/menu.services';
import { apis } from '../../../../../models/apis.model';
import { Menus } from '../../../../../models/menus.model';

@Component({
  selector: 'app-menus-editar',
  standalone: true,
  imports: [MenusFrmComponent],
  templateUrl: './menus-editar.component.html',
  styleUrl: './menus-editar.component.css'
})
export class MenusEditarComponent {
  id:number | undefined;
  menu!: Menus;

  constructor(private route: ActivatedRoute, private ms: MenuService) {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      this.id = idParam ? +idParam : undefined;
    });
  }

  async ngOnInit() {
    if (this.id === undefined) {
      console.error('ID del menú no proporcionado o inválido');
      return;
    }
    
    let respose = await this.ms.getById('menus', this.id, apis.Seguridad);
    if(respose?.error) {
      console.error('Error al obtener el menú:', respose.error);
      return;
    } else {
      this.menu = respose?.data as Menus;
    }
  }
}
