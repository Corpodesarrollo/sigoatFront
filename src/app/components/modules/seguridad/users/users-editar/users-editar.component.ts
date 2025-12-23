import { Component } from '@angular/core';
import {  UsersFrmComponent } from "../users-frm/users-frm.component";
import { Roles } from '../../../../../models/roles.model';
import { ActivatedRoute } from '@angular/router';
import { RolesService } from '../../../../../services/roles.service';
import { apis } from '../../../../../models/apis.model';
import { User } from '../../../../../services/user';
import { Users } from '../../../../../models/users.model';

@Component({
  selector: 'app-users-editar',
  standalone: true,
  imports: [UsersFrmComponent],
  templateUrl: './users-editar.component.html',
  styleUrl: './users-editar.component.css'
})
export class UsersEditarComponent {
  id:number | undefined;
    user!: Users;
  
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
      
      let respose = await this.ms.getById('users', this.id, apis.Seguridad);
      if(respose?.error) {
        console.error('Error al obtener el usuario:', respose.error);
        return;
      } else {
        this.user = respose?.data as Users;
      }
    }
}
