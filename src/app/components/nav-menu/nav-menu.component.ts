import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { GenericService } from '../../services/generic.services';
import { Router } from '@angular/router';
import { PermisosService } from '../../services/permisos.services';
import { PermisosRol } from '../../models/permisosRol.model';
import { User } from '../../services/user.services';
import { Menus } from '../../models/menus.model';
import { AuthServices } from '../../services/auth.service';


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
  permisos: PermisosRol[] | undefined

  constructor(private auth: AuthServices, private router: Router, private permisosService: PermisosService, private cd: ChangeDetectorRef) {
  }

  async ngOnInit() {
    await this.auth.loadPermisos();
    this.user = new User();
    this.permisos = await this.auth.getPermisos() as PermisosRol[];
    if (this.permisos.length === 0 || this.permisos.length === undefined) {
      console.warn('No se encontraron permisos para el usuario actual.');
      return;
    }

    let grupos = this.agruparPorGrupo(this.permisos);
    //recorrer los grupos 
    let itemsGrupo = grupos.map((grupo) => this.cargarPorGrupo(grupo)).flat();

    this.items = itemsGrupo;
    this.cd.detectChanges();
  }

  // Cargar los permisos por grupo
  cargarPorGrupo(grupo: string): MenuItem[] {
    const permisosFiltrados = this.permisos?.filter(p => p.grupo === grupo) || [];

    if (grupo === 'Sin-grupo') {
      // Retorna el árbol directamente sin contenedor de grupo
      return this.construirArbolRecursivo(null, grupo);
    } else {
      // Solo un item por grupo, evita duplicaciones
      return [
        {
          label: grupo,
          expanded: true,
          items: this.construirArbolRecursivo(null, grupo)
        }
      ];
    }
  }

  private construirArbolRecursivo(id: number | null, grupo: string | null): MenuItem[] {
    let items: MenuItem[] = [];
    const permisosFiltrados = this.permisos ? this.permisos.filter(p => p.idMenuPadre === id && p.grupo === grupo) : [];

    for (const permiso of permisosFiltrados) {
      if (permiso.path === undefined || permiso.path === '') {
        items.push({
          label: permiso.nombreMenu,
          expanded: true,
          items: this.construirArbolRecursivo(permiso.idMenu, grupo)
        });
      } else {
        if (permiso.tablero) {
          items.push({
            label: permiso.nombreMenu,
            routerLink: permiso.path,
            expanded: true,
            command: () => {
              this.router.navigate([`/tablero/${permiso.idTablero}`]);
            },
            items: this.construirArbolRecursivo(permiso.idMenu, grupo)
          });
        } else {
          items.push({
            label: permiso.nombreMenu,
            routerLink: permiso.path,
            expanded: true,
            command: () => {
              this.router.navigate([permiso.path]);
            },
            items: this.construirArbolRecursivo(permiso.idMenu, grupo)
          });
        }
      }
        //console.log('Permiso procesado:', permiso.nombreMenu, 'ID:', permiso.idMenu, 'Padre ID:', permiso.idMenuPadre);
    }

    return items;
  }

  private agruparPorGrupo(menus: PermisosRol[] | undefined): string[] {
    const grupos: string[] = [];
    if (this.permisos) {
      this.permisos.forEach(permiso => {
        if (!permiso.grupo && !grupos.includes('Sin-grupo')) {
          grupos.push('Sin-grupo');
        }
        
        if (permiso.grupo && !grupos.includes(permiso.grupo as string)) {
          grupos.push(permiso.grupo as string);
        }

        if(!permiso.grupo){
          permiso.grupo = 'Sin-grupo';
        }
      });
    }
    //console.log('Grupos encontrados:', grupos);
    return grupos;
  }
}
