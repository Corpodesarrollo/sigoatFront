import { Component } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { MenuService } from './services/menu.service';
import { GenericService } from './services/generic.service';
import { environment } from '../environments/environment';
import { ConfiguracionService } from './services/configuracion.service';
import { apis } from './models/apis.model';
import { ThemeService } from './services/theme.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    standalone: false
})
export class AppComponent {
    constructor(private configService: ConfiguracionService, private theme: ThemeService) {
        this.loadConfig();
    }

    async loadConfig() {
        let result = await this.configService.getFirst('configuracion', apis.Administrador);
        if (result && result.data) {
            const config = result.data;
            console.log('Configuración cargada:', config);
            if (config.colorGovCo) {
                this.theme.setVariable('--color-header-govco',  config.colorGovCo);
            }

            if (config.colorPrincipal) {
                this.theme.setVariable('--color-principal',  config.colorPrincipal);
            }

            if (config.logoIzquierdo) {
                console.log('Cargando logo izquierdo:', config.logoIzquierdo);
                this.theme.setVariable('--logo-left', `url(${this.cargarUrl(config.logoIzquierdo.fileName)})`);
            }

            if (config.logoDerecho) {
                this.theme.setVariable('--logo-right', `url(${this.cargarUrl(config.logoDerecho.fileName)})`);
            }

            if (config.redesSociales !== undefined) {
                this.theme.setVariable('--ver-redes', config.redesSociales ? 'block' : 'none');
            }
        }
    }

    cargarUrl(id: string | null): string {
        console.log('Cargar URL para ID:', `${environment.urlMSAdministracion}Configuracion/GetImg/${id}`);
        return `${environment.urlMSAdministracion}Configuracion/GetImg/${id}`;
    }
}



