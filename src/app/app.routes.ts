import { Routes } from '@angular/router';

import { HealthComponent } from './components/health/health.component';
import { LayoutComponent } from './layout/layout.component';
import { LayoutSecondaryComponent } from './layout-secondary/layout-secondary.component';
import { HomeComponent } from './components/modules/home/home.component';
import { MenusConsultarComponent } from './components/modules/seguridad/menus/menus-consultar/menus-consultar.component';
import { MenusCrearComponent } from './components/modules/seguridad/menus/menus-crear/menus-crear.component';
import { MenusEditarComponent } from './components/modules/seguridad/menus/menus-editar/menus-editar.component';

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
    ]
  }
];
