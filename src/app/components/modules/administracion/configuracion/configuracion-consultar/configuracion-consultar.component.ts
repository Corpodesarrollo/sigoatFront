import { Component } from '@angular/core';
import { apis } from '../../../../../models/apis.model';
import { TableModule } from 'primeng/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { MsgBoxComponent } from '../../../../shared/msg-box/msg-box.component';
import { Configuracion } from '../../../../../models/configuracion.model';
import { ConfiguracionService } from '../../../../../services/configuracion.service';
import { ConfiguracionFrmComponent } from "../configuracion-frm/configuracion-frm.component";

@Component({
  selector: 'app-configuracion-consultar',
  standalone: true,
  templateUrl: './configuracion-consultar.component.html',
  styleUrl: './configuracion-consultar.component.css',
  imports: [TableModule, ButtonModule, TooltipModule, CommonModule, ConfirmDialogModule, ToastModule, InputSwitchModule, FormsModule, MsgBoxComponent, ConfiguracionFrmComponent],
  providers: [ConfirmationService, MessageService]
})
export class ConfiguracionConsultarComponent {

  config!: Configuracion;

  constructor(private route: ActivatedRoute, private ms: ConfiguracionService) {
  }

  async ngOnInit() {
    let respose = await this.ms.getFirst('configuracion', apis.Administrador);
    if(respose?.error) {
      console.error('Error al obtener la configuración:', respose.error);
      return;
    } else {
      this.config = respose?.data as Configuracion;
    }
  }
}
