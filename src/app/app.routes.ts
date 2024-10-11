import { Routes } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { ContentComponent } from './components/content/content.component';
import { ContenthomeComponent } from './components/contenthome/contenthome.component';


export const routes: Routes = [

  { path: '', component: ContenthomeComponent },
  { path: 'home', component: ContenthomeComponent },
  { path: 'login', component: LoginComponent },

  {
    path: 'pagina',
    component: ContentComponent,
    loadChildren: () =>
      import('./components/modules/paginas/paginas.module').then(
        (m) => m.PaginasModule
      )
  },




];
