import { Component } from '@angular/core';
import { apis } from '../../../../../models/apis.model';
import { FooterInformacionInstitucional } from '../../../../../models/footerInformacionInstitucional.model';
import { FooterInformacionInstitucionalService } from '../../../../../services/footerInformacionInstitucional.service';
import { FooterInformacionInstitucionalFrmComponent } from '../footerInformacionInstitucional-frm/footerInformacionInstitucional-frm.component';

@Component({
  selector: 'app-footerInformacionInstitucional-consultar',
  standalone: true,
  templateUrl: './footerInformacionInstitucional-consultar.component.html',
  styleUrl: './footerInformacionInstitucional-consultar.component.css',
  imports: [FooterInformacionInstitucionalFrmComponent]
})
export class FooterInformacionInstitucionalConsultarComponent {

  config!: FooterInformacionInstitucional;

  constructor(private ms: FooterInformacionInstitucionalService) {
  }

  async ngOnInit() {
    let respose = await this.ms.getFirst('footerInformacionInstitucional', apis.Administrador);
    if(respose?.error) {
      console.error('Error al obtener la información institucional:', respose.error);
      return;
    } else {
      this.config = respose?.data as FooterInformacionInstitucional;
    }
  }
}
