import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { apis } from '../../../../../models/apis.model';
import { FooterNormatividad } from '../../../../../models/footerNormatividad.model';
import { FooterNormatividadService } from '../../../../../services/footerNormatividad.service';
import { FooterNormatividadFrmComponent } from "../footerNormatividad-frm/footerNormatividad-frm.component";

@Component({
  selector: 'app-footerNormatividad-editar',
  standalone: true,
  imports: [FooterNormatividadFrmComponent],
  templateUrl: './footerNormatividad-editar.component.html',
  styleUrl: './footerNormatividad-editar.component.css'
})
export class FooterNormatividadEditarComponent {
  id:number | undefined;
    footerNormatividad!: FooterNormatividad;
  
    constructor(private route: ActivatedRoute, private ms: FooterNormatividadService) {
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
      
      let respose = await this.ms.getById('footerNormatividad', this.id, apis.Administrador);
      if(respose?.error) {
        console.error('Error al obtener la página:', respose.error);
        return;
      } else {
        this.footerNormatividad = respose?.data as FooterNormatividad;
      }
    }

}
