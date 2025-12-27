import { Component, OnInit } from '@angular/core';
import { FooterFaq } from '../../models/footerFaq.model';
import { FooterNormatividad } from '../../models/footerNormatividad.model';
import { FooterInformacionInstitucional } from '../../models/footerInformacionInstitucional.model';
import { FooterFaqService } from '../../services/footerFaq.service';
import { FooterNormatividadService } from '../../services/footerNormatividad.service';
import { FooterInformacionInstitucionalService } from '../../services/footerInformacionInstitucional.service';
import { apis } from '../../models/apis.model';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.css',
    standalone: false
})
export class FooterComponent implements OnInit {
    faqs: FooterFaq[] = [];
    normatividad: FooterNormatividad[] = [];
    infoInstitucional: FooterInformacionInstitucional | null = null;
    
    faqExpandido: number | null = null;

    constructor(
        private faqService: FooterFaqService,
        private normatividadService: FooterNormatividadService,
        private infoService: FooterInformacionInstitucionalService
    ) {}

    async ngOnInit(): Promise<void> {
        await this.cargarDatos();
    }

    async cargarDatos(): Promise<void> {
        // Cargar FAQs activas
        const faqResponse = await this.faqService.getAll('footerFaq/activos', apis.Administrador);
        if (faqResponse && !faqResponse.error) {
            this.faqs = faqResponse.data as FooterFaq[];
        }

        // Cargar Normatividad activa
        const normResponse = await this.normatividadService.getAll('footerNormatividad/activos', apis.Administrador);
        if (normResponse && !normResponse.error) {
            this.normatividad = normResponse.data as FooterNormatividad[];
        }

        // Cargar Información Institucional
        const infoResponse = await this.infoService.getFirst('footerInformacionInstitucional', apis.Administrador);
        if (infoResponse && !infoResponse.error) {
            this.infoInstitucional = infoResponse.data as FooterInformacionInstitucional;
        }
    }

    toggleFaq(faqId: number | undefined): void {
        if (faqId === undefined) return;
        this.faqExpandido = this.faqExpandido === faqId ? null : faqId;
    }

    isFaqExpandido(faqId: number | undefined): boolean {
        return faqId !== undefined && this.faqExpandido === faqId;
    }

    getLogoUrl(): string {
        if (this.infoInstitucional?.idLogoOficial) {
            return `${environment.urlMSAdministracion}footerInformacionInstitucional/GetImg/${this.infoInstitucional.idLogoOficial}`;
        }
        return '';
    }
}
