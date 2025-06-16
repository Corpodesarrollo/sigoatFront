import { Routes } from '@angular/router';

import { HealthComponent } from './components/health/health.component';
import { LayoutComponent } from './layout/layout.component';
import { HomeComponent } from './components/modules/home/home.component';
import { MenusConsultarComponent } from './components/modules/seguridad/menus/menus-consultar/menus-consultar.component';
import { MenusCrearComponent } from './components/modules/seguridad/menus/menus-crear/menus-crear.component';
import { MenusEditarComponent } from './components/modules/seguridad/menus/menus-editar/menus-editar.component';
import { ModulosConsultarComponent } from './components/modules/seguridad/modulos/modulos-consultar/modulos-consultar.component';
import { ModulosCrearComponent } from './components/modules/seguridad/modulos/modulos-crear/modulos-crear.component';
import { ModulosEditarComponent } from './components/modules/seguridad/modulos/modulos-editar/modulos-editar.component';
import { RolesConsultarComponent } from './components/modules/seguridad/roles/roles-consultar/roles-consultar.component';
import { RolesCrearComponent } from './components/modules/seguridad/roles/roles-crear/roles-crear.component';
import { RolesEditarComponent } from './components/modules/seguridad/roles/roles-editar/roles-editar.component';
import { PermisosConsultarComponent } from './components/modules/seguridad/permisos/permisos-consultar/permisos-consultar.component';
import { PaginasConsultarComponent } from './components/modules/administracion/paginas/paginas-consultar/paginas-consultar.component';
import { LayoutSecondaryComponent } from './layout-secondary/layout-secondary.component';
import { PaginasComponent } from './components/modules/portal/paginas/paginas.component';
import { PaginasEditarComponent } from './components/modules/administracion/paginas/paginas-editar/paginas-editar.component';
import { PaginasCrearComponent } from './components/modules/administracion/paginas/paginas-crear/paginas-crear.component';
import { CarruselComponent } from './components/modules/administracion/carrusel/carrusel.component';
import { CalendarioComponent } from './components/modules/administracion/calendario/calendario.component';
import { ContactoComponent } from './components/modules/administracion/contactenos/contactenos.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'home', component: HomeComponent },
      { path: 'health', component: HealthComponent },
      { path: 'menus', component: MenusConsultarComponent },
      { path: 'menus-crear', component: MenusCrearComponent },
      { path: 'menus-editar/:id', component: MenusEditarComponent },
      { path: 'modulos', component: ModulosConsultarComponent },
      { path: 'modulos-crear', component: ModulosCrearComponent },
      { path: 'modulos-editar/:id', component: ModulosEditarComponent },
      { path: 'roles', component: RolesConsultarComponent },
      { path: 'roles-crear', component: RolesCrearComponent },
      { path: 'roles-editar/:id', component: RolesEditarComponent },
      { path: 'permisos', component: PermisosConsultarComponent },
      { path: 'paginas', component: PaginasConsultarComponent },
      { path: 'paginas-crear', component: PaginasCrearComponent },
      { path: 'paginas-editar/:id', component: PaginasEditarComponent },
      { path: 'carrusel/:id', component: CarruselComponent },
      { path: 'calendario', component: CalendarioComponent },
      { path: 'contactenos', component: ContactoComponent },

    ]
  },
  {
    path: '',
    component: LayoutSecondaryComponent,
    children: [
      { path: 'prueba', component: PaginasComponent },
    ]
  }
];
