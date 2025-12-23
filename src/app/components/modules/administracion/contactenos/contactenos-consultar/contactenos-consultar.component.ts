import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TableModule, TableLazyLoadEvent } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { apis } from '../../../../../models/apis.model';
import { Menus } from '../../../../../models/menus.model';
import { MsgBotones } from '../../../../../models/msgBotones.model';
import { MsgTipo } from '../../../../../models/msgTipo.model';
import { ResponseModel } from '../../../../../models/response.model';
import { MenuService } from '../../../../../services/menu.service';
import { MsgBoxComponent } from '../../../../shared/msg-box/msg-box.component';
import { ContactenosService } from '../../../../../services/contactenos.service';
import { Contactenos } from '../../../../../models/contactenos.model';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-contactenos-consultar',
  standalone: true,
  imports: [TableModule, ButtonModule, TooltipModule, CommonModule, ConfirmDialogModule, ToastModule, InputSwitchModule, FormsModule, MsgBoxComponent, DialogModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './contactenos-consultar.component.html',
  styleUrl: './contactenos-consultar.component.css'
})
export class ContactenosConsultarComponent {
  pages: Contactenos[] = [];
  totalRecords: number = 0;
  rowsPerPage: number = 10;
  loading: boolean = true;
  visible: boolean = false;
  msg: string = '';
  MsgTipo = MsgTipo;
  MsgBotones = MsgBotones;
  error: boolean = false;
  idEliminar: number = 0;
  displayModal: boolean = false;

  formulario: Contactenos = {
    id: 0,
    nombreCompleto: '',
    email: '',
    telefono: '',
    asunto: '',
    mensaje: '',
  };

  constructor(private messageService: MessageService, private ms: ContactenosService, private router: Router) {}

  ngOnInit() {
    // Carga inicial puede estar vacía o cargar primera página
  }

  async loadPages(event: TableLazyLoadEvent)  {
    this.loading = true;
    
    const page = (event.first || 0) / (event.rows || this.rowsPerPage) + 1;
    const pageSize = event.rows || this.rowsPerPage;

    let menusResponse = await this.ms.getOnDemand('contactenos', page, pageSize, '', apis.Administrador);
    if (menusResponse) {
      let result: ResponseModel = menusResponse;
      if (result.error) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: result.dataError.message });
        this.loading = false;
        return;
      }

      let data: {value: any[], count: number} = result.data;
      this.pages = data.value as Contactenos[];
      this.totalRecords = data.count; // Asumiendo que la respuesta contiene el total de registros
      this.loading = false;
    } else{
      this.loading = false;
      return;
    }
  }

  info(data: Contactenos): void {
    this.formulario = { ...data }; // Clonar el objeto para evitar referencias
    this.displayModal = true; // Mostrar el modal con la información
  }

  onHide(event: any): void {
    console.log('Dialog closed', event);
    this.visible = false;
    if (event == true) {
      this.ms.delete('contactenos', this.idEliminar, apis.Administrador).then((response) => {
        if (response) {
          let result: ResponseModel = response;
          if (result.error) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: result.dataError.message });
          } else {
            this.loadPages({ first: 0, rows: this.rowsPerPage } as TableLazyLoadEvent);
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Registro eliminado correctamente' });
          }
        }
      });
    }
  }
}
