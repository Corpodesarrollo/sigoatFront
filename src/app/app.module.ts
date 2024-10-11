import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // Importa FormsModule aquí

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { routes } from './app.routes';
import { NavMenuComponent } from './components/nav-menu/nav-menu.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { MenuModule } from 'primeng/menu';
import { BadgeModule } from 'primeng/badge';
import { RippleModule } from 'primeng/ripple';
import { AvatarModule } from 'primeng/avatar';
import { TableModule } from 'primeng/table';
import { ContentComponent } from './components/content/content.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
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

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavMenuComponent,
    HeaderComponent,
    FooterComponent,
    ContentComponent,

  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CommonModule,
    RouterModule,
    FormsModule,

    /** PrimeNG */
    MenuModule,
    BadgeModule,
    RippleModule,
    AvatarModule,
    TableModule,
    ProgressSpinnerModule,
    InputTextModule,
    CalendarModule,
    IconFieldModule,
    InputIconModule

    /**Component standalone */


],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
