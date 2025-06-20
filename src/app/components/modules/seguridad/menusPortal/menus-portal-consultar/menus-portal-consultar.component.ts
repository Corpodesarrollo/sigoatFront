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
import { MsgBoxComponent } from '../../../../shared/msg-box/msg-box.component';
import { MenuPortalServices } from '../../../../../services/menuPortal.services';

@Component({
  selector: 'app-menus-portal-consultar',
  standalone: true,
  imports: [TableModule, ButtonModule, TooltipModule, CommonModule, ConfirmDialogModule, ToastModule, InputSwitchModule, FormsModule, MsgBoxComponent],
  providers: [ConfirmationService, MessageService],
  templateUrl: './menus-portal-consultar.component.html',
  styleUrl: './menus-portal-consultar.component.css'
})
export class MenusPortalConsultarComponent {
  pages: Menus[] = [];
  totalRecords: number = 0;
  rowsPerPage: number = 10;
  loading: boolean = true;
  visible: boolean = false;
  msg: string = '';
  MsgTipo = MsgTipo;
  MsgBotones = MsgBotones;
  error: boolean = false;
  idEliminar: number = 0;
  
  
    constructor(private messageService: MessageService, private ms: MenuPortalServices, private router: Router) {}
  
    ngOnInit() {
      // Carga inicial puede estar vacía o cargar primera página
    }
  
    async loadPages(event: TableLazyLoadEvent)  {
      this.loading = true;
      
      const page = (event.first || 0) / (event.rows || this.rowsPerPage) + 1;
      const pageSize = event.rows || this.rowsPerPage;
  
      let menusResponse = await this.ms.getOnDemand('menusPortal', page, pageSize, '', apis.Seguridad);
      if (menusResponse) {
        let result: ResponseModel = menusResponse;
        if (result.error) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: result.dataError.message });
          this.loading = false;
          return;
        }
  
        let data: {value: any[], count: number} = result.data;
        this.pages = data.value as Menus[];
        this.totalRecords = data.count; // Asumiendo que la respuesta contiene el total de registros
        this.loading = false;
      } else{
        this.loading = false;
        return;
      }
    }
  
    validarEstado(estado: boolean): string {
      return !estado ? 'Activar' : 'Inactivar';
    }
  
    agregar() {
      this.router.navigate([`/menusPortal-crear`]);
    }
  
    edit(page: any) {
      this.router.navigate([`/menusPortal-editar/${page.id}`]);
    }
  
    async onToggleChange(data: any) {
      let menu: Menus = data;
      let responseActivation = await this.ms.putActivateDeactivate('menusPortal', data.id, apis.Seguridad);
      if (responseActivation) {
        let result: ResponseModel = responseActivation;
        if (result.error) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: result.dataError.message });
          return;
        } else if (result.data) {
          if (!menu.estado) {
            this.messageService.add({ severity: 'error', summary: 'Éxito', detail: 'Registro inactivado correctamente' });
          } else {
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Registro activado correctamente' });
          }
        }
      }
    }
  
    confirmDelete(event: Event, id: number) {
      this.visible = true;
      this.msg = '¿Desea eliminar este registro?';
      this.idEliminar = id;
    }
  
    onHide(event: any): void {
      console.log('Dialog closed', event);
      this.visible = false;
      if (event == true) {
        this.ms.delete('menusPortal', this.idEliminar, apis.Seguridad).then((response) => {
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
