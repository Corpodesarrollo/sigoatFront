import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { apis } from '../../../../../models/apis.model';
import { FooterFaq } from '../../../../../models/footerFaq.model';
import { FooterFaqService } from '../../../../../services/footerFaq.service';
import { FooterFaqFrmComponent } from "../footerFaq-frm/footerFaq-frm.component";

@Component({
  selector: 'app-footerFaq-editar',
  standalone: true,
  imports: [FooterFaqFrmComponent],
  templateUrl: './footerFaq-editar.component.html',
  styleUrl: './footerFaq-editar.component.css'
})
export class FooterFaqEditarComponent {
  id:number | undefined;
    footerFaq!: FooterFaq;
  
    constructor(private route: ActivatedRoute, private ms: FooterFaqService) {
      this.route.paramMap.subscribe(params => {
        const idParam = params.get('id');
        this.id = idParam ? +idParam : undefined;
      });
    }
  
    async ngOnInit() {
      if (this.id === undefined) {
        console.error('ID de la página no proporcionado o inválido');
        return;
      }
      
      let respose = await this.ms.getById('footerFaq', this.id, apis.Administrador);
      if(respose?.error) {
        console.error('Error al obtener la página:', respose.error);
        return;
      } else {
        this.footerFaq = respose?.data as FooterFaq;
      }
    }

}
