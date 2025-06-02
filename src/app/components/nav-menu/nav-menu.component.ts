import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { GenericService } from '../../services/generic.services';
import { Router } from '@angular/router';
import { PermisosService } from '../../services/permisos.service';
import { PermisosRol } from '../../models/permisosRol.model';
import { User } from '../../services/user.service';

@Component({
    selector: 'app-nav-menu',
    templateUrl: './nav-menu.component.html',
    styleUrl: './nav-menu.component.css',
    standalone: false
})
export class NavMenuComponent implements OnInit {
  items: MenuItem[] | undefined;
  arregloMenu: any[] = [];
  user = new User();

  constructor(private service: GenericService, private router: Router, private permisosService: PermisosService, private cd: ChangeDetectorRef) {

  }

  async ngOnInit() {
    //Cordinador
    this.user.rolId = 1;

    let permisos = await this.permisosService.getByRol(1);
    if (permisos) {
      this.cargarMenus(permisos);
    }
  }

  cargarMenus(permisos: PermisosRol[]) {
    const menuMap = new Map<string, any>();
    // Iterar sobre los permisos para construir el menú
    permisos.forEach((permiso: PermisosRol) => {
      // Verificar si el permiso tiene un menú asociado
      if (permiso.nombreMenu) {
        // Si el menú ya existe, agregar el permiso como submenú
        if (menuMap.has(permiso.nombreMenu)) {
          menuMap.get(permiso.nombreMenu).items.push({
            label: permiso.nombreMenu,
            icon: 'pi pi-fw pi-plus', // Puedes cambiar el icono según sea necesario
            command: () => {
              this.router.navigate(['/' + permiso.nombreMenu]);
            }
          });
        } else {
          // Si el menú no existe, crear una nueva entrada
          menuMap.set(permiso.nombreMenu, {
            label: permiso.nombreMenu,
            items: [{
              label: permiso.nombreMenu,
              icon: 'pi pi-fw pi-plus', // Puedes cambiar el icono según sea necesario
              command: () => {
                this.router.navigate(['/' + permiso.nombreMenu]);
              }
            }]
          });
        }
      }
    });

    // Convertir el mapa a un array
    this.arregloMenu = Array.from(menuMap.values());
    this.items = this.arregloMenu;
    this.cd.detectChanges();
  }
}
