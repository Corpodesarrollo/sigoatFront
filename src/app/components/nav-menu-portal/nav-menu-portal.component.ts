import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { PermisosRol } from '../../models/permisosRol.model';
import { GenericService } from '../../services/generic.services';
import { PermisosService } from '../../services/permisos.services';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MenubarModule } from 'primeng/menubar';

@Component({
  selector: 'app-nav-menu-portal',
  standalone: true,
  imports: [MenubarModule],
  templateUrl: './nav-menu-portal.component.html',
  styleUrl: './nav-menu-portal.component.css'
})
export class NavMenuPortalComponent {
  items: MenuItem[] | undefined;
  permisos: PermisosRol[] | undefined

  constructor(private service: GenericService, private router: Router, private permisosService: PermisosService, private cd: ChangeDetectorRef) {

  }

  async ngOnInit() {
    let permisosResult = await this.permisosService.getPortal();
    if (permisosResult.error) {
      console.error('Error al obtener los permisos:', permisosResult.dataError);
    } else {
      this.permisos = permisosResult.data;
      let itemsGrupo = this.construirArbolRecursivo(null);

      this.items = itemsGrupo;
      
      //console.log('Permisos obtenidos2:', this.items);
      this.cd.detectChanges();
    }
  }

  private construirArbolRecursivo(id: number | null): MenuItem[] {
    let items: MenuItem[] = [];
    const permisosFiltrados = this.permisos ? this.permisos.filter(p => p.idMenuPadre === id) : [];

    for (const permiso of permisosFiltrados) {
      if (permiso.path === undefined || permiso.path === '') {
        items.push({
          label: permiso.nombreMenu,
          expanded: true,
          items: this.construirArbolRecursivo(permiso.idMenu)
        });
      } else {
        items.push({
          label: permiso.nombreMenu,
          routerLink: permiso.path,
          expanded: true,
          command: () => {
            this.router.navigate([permiso.path]);
          },
          items: this.construirArbolRecursivo(permiso.idMenu)
        });
      }
    }

    return items;
  }

  filtrar(event: any) {
    const texto = event.target.value.toLowerCase();
  }
}
