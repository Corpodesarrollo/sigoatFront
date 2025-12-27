import { CommonModule } from '@angular/common';
import { Component, Input, SimpleChanges } from '@angular/core';
import { Anexos } from '../../../models/anexos.model';
import { AnexosService } from '../../../services/anexos.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { apis } from '../../../models/apis.model';
import { ResponseModel } from '../../../models/response.model';
import { PaginasService } from '../../../services/paginas.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-documentos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './documentos.component.html',
  styleUrl: './documentos.component.css',
  providers: [ConfirmationService, MessageService],
})
export class DocumentosComponent {
  @Input() id: number = 1;
  documents: Anexos[] = [];

  constructor(private messageService: MessageService, private ms: AnexosService, private ps: PaginasService, private route: ActivatedRoute, private router: Router) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id']) {
      this.id = changes['id'].currentValue;
      this.ngOnInit();
    }
  }

  async ngOnInit(): Promise<void> {
    let anexo = await this.ms.getAllById("anexos", this.id, apis.Administrador);
    if (anexo) {
      let result: ResponseModel = anexo;
      if (result.error) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: result.dataError.message });
        return;
      }
      
      this.documents = result.data;
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar los documentos.' });
    }
  }

  descargar(id: number): void {
    window.open(`${environment.urlMSAdministracion}Anexos/GetDoc/${id}`, '_blank');
  }
}
