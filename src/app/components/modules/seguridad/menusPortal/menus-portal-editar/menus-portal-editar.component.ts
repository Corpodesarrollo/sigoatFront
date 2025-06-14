import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { apis } from '../../../../../models/apis.model';
import { Menus } from '../../../../../models/menus.model';
import { MenuService } from '../../../../../services/menu.services';
import { MenusFrmComponent } from '../../menus/menus-frm/menus-frm.component';
import { MenusPortalFrmComponent } from "../menus-portal-frm/menus-portal-frm.component";

@Component({
  selector: 'app-menus-portal-editar',
  standalone: true,
  imports: [MenusFrmComponent, MenusPortalFrmComponent],
  templateUrl: './menus-portal-editar.component.html',
  styleUrl: './menus-portal-editar.component.css'
})
export class MenusPortalEditarComponent {
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
      
      let respose = await this.ms.getById('menusPortal', this.id, apis.Seguridad);
      if(respose?.error) {
        console.error('Error al obtener el menú:', respose.error);
        return;
      } else {
        this.menu = respose?.data as Menus;
      }
    }
}
