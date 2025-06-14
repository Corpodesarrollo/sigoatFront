import { Component } from '@angular/core';
import { RolesFrmComponent } from "../roles-frm/roles-frm.component";
import { Roles } from '../../../../../models/roles.model';
import { ActivatedRoute } from '@angular/router';
import { RolesService } from '../../../../../services/roles.services';
import { apis } from '../../../../../models/apis.model';

@Component({
  selector: 'app-roles-editar',
  standalone: true,
  imports: [RolesFrmComponent],
  templateUrl: './roles-editar.component.html',
  styleUrl: './roles-editar.component.css'
})
export class RolesEditarComponent {
  id:number | undefined;
    rol!: Roles;
  
    constructor(private route: ActivatedRoute, private ms: RolesService) {
      this.route.paramMap.subscribe(params => {
        const idParam = params.get('id');
        this.id = idParam ? +idParam : undefined;
      });
    }
  
    async ngOnInit() {
      if (this.id === undefined) {
        console.error('ID del rol no proporcionado o inválido');
        return;
      }
      
      let respose = await this.ms.getById('roles', this.id, apis.Seguridad);
      if(respose?.error) {
        console.error('Error al obtener el rol:', respose.error);
        return;
      } else {
        this.rol = respose?.data as Roles;
      }
    }
}
