import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // Importa FormsModule aquí

import { AppComponent } from './app.component';
import { routes } from './app.routes';
import { NavMenuComponent } from './components/nav-menu/nav-menu.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { MenuModule } from 'primeng/menu';
import { BadgeModule } from 'primeng/badge';
import { RippleModule } from 'primeng/ripple';
import { AvatarModule } from 'primeng/avatar';
import { TableModule } from 'primeng/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ListboxModule } from 'primeng/listbox';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { HealthCheckInterceptor } from './interceptors/health-check.service';
import { DialogService } from 'primeng/dynamicdialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { LayoutComponent } from './layout/layout.component';
import { LayoutSecondaryComponent } from './layout-secondary/layout-secondary.component';
import { MsgBoxComponent } from './components/shared/msg-box/msg-box.component';
import { PanelMenuModule } from 'primeng/panelmenu';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { NavMenuPortalComponent } from "./components/nav-menu-portal/nav-menu-portal.component";
import { AccesibilidadComponent } from "./components/shared/accesibilidad/accesibilidad.component";
import { appConfig } from './services/app.configCalendario'; 
import { MsalModule, MsalService  } from '@azure/msal-angular';
import { MSALInstanceFactory } from './services/app.configCalendario';
import { InteractionType } from '@azure/msal-browser';
import { CalendarioComponent } from './components/modules/administracion/calendario/calendario.component';
import { ContactoComponent } from './components/modules/administracion/contactenos/contactenos.component';
import { ReactiveFormsModule } from '@angular/forms'; // ✅ <-- Esto es clave

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HeaderComponent,
    FooterComponent,
    LayoutComponent,
    LayoutSecondaryComponent,
    CalendarioComponent,
    ContactoComponent,
    
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CommonModule,
    RouterModule,
    FormsModule,
    MenuModule,
    BadgeModule,
    RippleModule,
    AvatarModule,
    TableModule,
    ProgressSpinnerModule,
    InputTextModule,
    CalendarModule,
    IconFieldModule,
    InputIconModule,
    MultiSelectModule,
    PanelMenuModule,
    TieredMenuModule,
    NavMenuPortalComponent,
    ReactiveFormsModule,
    AccesibilidadComponent,
    MsalModule.forRoot(MSALInstanceFactory(), {
      interactionType: InteractionType.Redirect,
      authRequest: {
        scopes: ['user.read']
      }
    }, {
      interactionType: InteractionType.Redirect,
      protectedResourceMap: new Map()
    })
  ],

  providers: [
    ...appConfig, 
    DialogService,
    { provide: HTTP_INTERCEPTORS, useClass: HealthCheckInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
