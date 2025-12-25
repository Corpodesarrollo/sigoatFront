import { Routes } from '@angular/router';
import { ModuloGuard } from './services/modulo.guard';
import { LayoutComponent } from './layout/layout.component';
import { HealthComponent } from './components/health/health.component';
import { HomeComponent } from './components/modules/home/home.component';
import { LayoutSecondaryComponent } from './layout-secondary/layout-secondary.component';
import { PaginasComponent } from './components/modules/portal/paginas/paginas.component';
import { NoticiaComponent } from './components/modules/portal/noticia/noticia.component';
import { CarruselComponent } from './components/modules/administracion/carrusel/carrusel.component';
import { NoticiasComponent } from './components/modules/administracion/noticias/noticias.component';
import { ContactenosComponent } from './components/modules/portal/contactenos/contactenos.component';
import { CalendarioComponent } from './components/modules/administracion/calendario/calendario.component';
import { DocumentosComponent } from './components/modules/administracion/documentos/documentos.component';
import { MenusCrearComponent } from './components/modules/seguridad/menus/menus-crear/menus-crear.component';
import { RolesCrearComponent } from './components/modules/seguridad/roles/roles-crear/roles-crear.component';
import { MenusEditarComponent } from './components/modules/seguridad/menus/menus-editar/menus-editar.component';
import { RolesEditarComponent } from './components/modules/seguridad/roles/roles-editar/roles-editar.component';
import { NoAutorizadoComponent } from './components/modules/administracion/no-autorizado/no-autorizado.component';
import { ModulosCrearComponent } from './components/modules/seguridad/modulos/modulos-crear/modulos-crear.component';
import { ModulosEditarComponent } from './components/modules/seguridad/modulos/modulos-editar/modulos-editar.component';
import { RolesConsultarComponent } from './components/modules/seguridad/roles/roles-consultar/roles-consultar.component';
import { MenusConsultarComponent } from './components/modules/seguridad/menus/menus-consultar/menus-consultar.component';
import { PaginasCrearComponent } from './components/modules/administracion/paginas/paginas-crear/paginas-crear.component';
import { DetallesNoticiaComponent } from './components/modules/administracion/detalles-noticia/detalles-noticia.component';
import { TablerosViewComponent } from './components/modules/administracion/tableros/tableros-view/tableros-view.component';
import { PaginasEditarComponent } from './components/modules/administracion/paginas/paginas-editar/paginas-editar.component';
import { TablerosCrearComponent } from './components/modules/administracion/tableros/tableros-crear/tableros-crear.component';
import { TablerosEditarComponent } from './components/modules/administracion/tableros/tableros-editar/tableros-editar.component';
import { ModulosConsultarComponent } from './components/modules/seguridad/modulos/modulos-consultar/modulos-consultar.component';
import { PermisosConsultarComponent } from './components/modules/seguridad/permisos/permisos-consultar/permisos-consultar.component';
import { PaginasConsultarComponent } from './components/modules/administracion/paginas/paginas-consultar/paginas-consultar.component';
import { MenusPortalCrearComponent } from './components/modules/seguridad/menusPortal/menus-portal-crear/menus-portal-crear.component';
import { MenusPortalEditarComponent } from './components/modules/seguridad/menusPortal/menus-portal-editar/menus-portal-editar.component';
import { TablerosConsultarComponent } from './components/modules/administracion/tableros/tableros-consultar/tableros-consultar.component';
import { MenusPortalConsultarComponent } from './components/modules/seguridad/menusPortal/menus-portal-consultar/menus-portal-consultar.component';
import { RedesSocialesCrearComponent } from './components/modules/administracion/redes-sociales/redes-sociales-crear/redes-sociales-crear.component';
import { ContactenosConsultarComponent } from './components/modules/administracion/contactenos/contactenos-consultar/contactenos-consultar.component';
import { NotificacionesCrearComponent } from './components/modules/administracion/notificaciones/notificaciones-crear/notificaciones-crear.component';
import { RedesSocialesEditarComponent } from './components/modules/administracion/redes-sociales/redes-sociales-editar/redes-sociales-editar.component';
import { NotificacionesEditarComponent } from './components/modules/administracion/notificaciones/notificaciones-editar/notificaciones-editar.component';
import { ConfiguracionConsultarComponent } from './components/modules/administracion/configuracion/configuracion-consultar/configuracion-consultar.component';
import { RedesSocialesConsultarComponent } from './components/modules/administracion/redes-sociales/redes-sociales-consultar/redes-sociales-consultar.component';
import { NotificacionesConsultarComponent } from './components/modules/administracion/notificaciones/notificaciones-consultar/notificaciones-consultar.component';
import { UsersConsultarComponent } from './components/modules/seguridad/users/users-consultar/users-consultar.component';
import { UsersCrearComponent } from './components/modules/seguridad/users/users-crear/users-crear.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: HomeComponent, canActivate: [ModuloGuard], data: { modulo: 'home' } },
      { path: 'calendario', component: CalendarioComponent },
      { path: 'carrusel/:id', component: CarruselComponent },
      { path: 'configuracion', component: ConfiguracionConsultarComponent },
      { path: 'contactenos', component: ContactenosConsultarComponent },
      { path: 'detallesNoticias/:idNoticia/:idPagina', component: DetallesNoticiaComponent },
      { path: 'documentos/:id', component: DocumentosComponent },
      { path: 'health', component: HealthComponent },
      { path: 'home', component: HomeComponent, canActivate: [ModuloGuard], data: { modulo: 'home' } },
      { path: 'menus', component: MenusConsultarComponent, canActivate: [ModuloGuard], data: { modulo: 'menus', permiso: 'consultar' } },
      { path: 'menus-crear', component: MenusCrearComponent, canActivate: [ModuloGuard], data: { modulo: 'menus', permiso: 'crear'  } },
      { path: 'menus-editar/:id', component: MenusEditarComponent, canActivate: [ModuloGuard], data: { modulo: 'menus', permiso: 'editar' } },
      { path: 'menusPortal', component: MenusPortalConsultarComponent, canActivate: [ModuloGuard], data: { modulo: 'menusPortal', permiso: 'consultar' } },
      { path: 'menusPortal-crear', component: MenusPortalCrearComponent, canActivate: [ModuloGuard], data: { modulo: 'menusPortal', permiso: 'crear' } },
      { path: 'menusPortal-editar/:id', component: MenusPortalEditarComponent, canActivate: [ModuloGuard], data: { modulo: 'menusPortal', permiso: 'editar' } },
      { path: 'modulos', component: ModulosConsultarComponent, canActivate: [ModuloGuard], data: { modulo: 'modulos', permiso: 'consultar' } },
      { path: 'modulos-crear', component: ModulosCrearComponent, canActivate: [ModuloGuard], data: { modulo: 'modulos', permiso: 'crear' } },
      { path: 'modulos-editar/:id', component: ModulosEditarComponent, canActivate: [ModuloGuard], data: { modulo: 'modulos', permiso: 'editar' } },
      { path: 'no-autorizado', component: NoAutorizadoComponent, canActivate: [ModuloGuard], data: { modulo: 'home' } },
      { path: 'noticias/:id', component: NoticiasComponent },
      { path: 'notificaciones', component: NotificacionesConsultarComponent, canActivate: [ModuloGuard], data: { modulo: 'notificaciones', permiso: 'consultar' } },
      { path: 'notificaciones-crear', component: NotificacionesCrearComponent, canActivate: [ModuloGuard], data: { modulo: 'notificaciones', permiso: 'crear'  } },
      { path: 'notificaciones-editar/:id', component: NotificacionesEditarComponent, canActivate: [ModuloGuard], data: { modulo: 'notificaciones', permiso: 'editar' } },
      { path: 'paginas', component: PaginasConsultarComponent, canActivate: [ModuloGuard], data: { modulo: 'paginas', permiso: 'consultar' } },
      { path: 'paginas-crear', component: PaginasCrearComponent, canActivate: [ModuloGuard], data: { modulo: 'paginas', permiso: 'crear' } },
      { path: 'paginas-editar/:id', component: PaginasEditarComponent, canActivate: [ModuloGuard], data: { modulo: 'paginas', permiso: 'editar' } },
      { path: 'permisos', component: PermisosConsultarComponent, canActivate: [ModuloGuard], data: { modulo: 'permisos', permiso: 'consultar' } },
      { path: 'redesSociales', component: RedesSocialesConsultarComponent, canActivate: [ModuloGuard], data: { modulo: 'redesSociales', permiso: 'consultar' } },
      { path: 'redesSociales-crear', component: RedesSocialesCrearComponent, canActivate: [ModuloGuard], data: { modulo: 'redesSociales', permiso: 'crear' } },
      { path: 'redesSociales-editar/:id', component: RedesSocialesEditarComponent, canActivate: [ModuloGuard], data: { modulo: 'redesSociales', permiso: 'editar' } },
      { path: 'roles', component: RolesConsultarComponent, canActivate: [ModuloGuard], data: { modulo: 'roles', permiso: 'consultar' } },
      { path: 'roles-crear', component: RolesCrearComponent, canActivate: [ModuloGuard], data: { modulo: 'roles', permiso: 'crear' } },
      { path: 'roles-editar/:id', component: RolesEditarComponent, canActivate: [ModuloGuard], data: { modulo: 'roles', permiso: 'editar' } },
      { path: 'tableros', component: TablerosConsultarComponent, canActivate: [ModuloGuard], data: { modulo: 'Tableros', permiso: 'consultar' } },
      { path: 'tablero/:id', component: TablerosViewComponent, canActivate: [ModuloGuard], data: { modulo: 'Tableros', permiso: 'consultar' } },
      { path: 'tableros-crear', component: TablerosCrearComponent, canActivate: [ModuloGuard], data: { modulo: 'Tableros', permiso: 'crear' } },
      { path: 'tableros-editar/:id', component: TablerosEditarComponent, canActivate: [ModuloGuard], data: { modulo: 'Tableros', permiso: 'editar' } },
      { path: 'usuarios', component: UsersConsultarComponent, canActivate: [ModuloGuard], data: { modulo: 'usuarios', permiso: 'consultar' } },
      { path: 'usuarios-crear', component: UsersCrearComponent, canActivate: [ModuloGuard], data: { modulo: 'usuarios', permiso: 'crear' } },
      { path: 'usuarios-editar/:id', component: UsersCrearComponent, canActivate: [ModuloGuard], data: { modulo: 'usuarios', permiso: 'editar' } },
    ]
  },
  {
    path: '',
    component: LayoutSecondaryComponent,
    children: [
      { path: 'consulta-ciudadana', component: ContactenosComponent },
      { path: 'portal/noticia/:idPagina/:idNoticia', component: NoticiaComponent },
      { path: 'portal', component: PaginasComponent },
      { path: 'portal/:id', component: PaginasComponent },
    ]
  }
];
