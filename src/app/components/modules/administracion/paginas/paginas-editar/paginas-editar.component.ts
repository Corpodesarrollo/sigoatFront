import { Component } from '@angular/core';
import { PaginasFrmComponent } from "../paginas-frm/paginas-frm.component";
import { PaginasService } from '../../../../../services/paginas.services';
import { ActivatedRoute } from '@angular/router';
import { apis } from '../../../../../models/apis.model';
import { Menus } from '../../../../../models/menus.model';
import { Paginas } from '../../../../../models/paginas.model';
import { StepsComponent } from "../../../../shared/steps/steps.component";

@Component({
  selector: 'app-paginas-editar',
  standalone: true,
  imports: [PaginasFrmComponent, StepsComponent],
  templateUrl: './paginas-editar.component.html',
  styleUrl: './paginas-editar.component.css'
})
export class PaginasEditarComponent {
  id:number | undefined;
    pagina!: Paginas;
  
    constructor(private route: ActivatedRoute, private ms: PaginasService) {
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
      
      let respose = await this.ms.getById('paginas', this.id, apis.Administrador);
      if(respose?.error) {
        console.error('Error al obtener la página:', respose.error);
        return;
      } else {
        this.pagina = respose?.data as Paginas;
      }
    }

}
