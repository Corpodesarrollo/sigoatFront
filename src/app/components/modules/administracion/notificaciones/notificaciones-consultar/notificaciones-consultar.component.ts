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
import { AuthServices } from '../../../../../services/auth.service';
import { MenuService } from '../../../../../services/menu.services';
import { MsgBoxComponent } from '../../../../shared/msg-box/msg-box.component';
import { Notificacion } from '../../../../../models/notificaciones.model';
import { permiso } from '../../../../../models/permiso';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-notificaciones-consultar',
  standalone: true,
  imports: [TableModule, ButtonModule, TooltipModule, CommonModule, ConfirmDialogModule, ToastModule, InputSwitchModule, FormsModule, MsgBoxComponent],
  providers: [ConfirmationService, MessageService],
  templateUrl: './notificaciones-consultar.component.html',
  styleUrl: './notificaciones-consultar.component.css'
})
export class NotificacionesConsultarComponent {
  pages: Notificacion[] = [];
  totalRecords: number = 0;
  rowsPerPage: number = 10;
  loading: boolean = true;
  visible: boolean = false;
  msg: string = '';
  MsgTipo = MsgTipo;
  MsgBotones = MsgBotones;
  error: boolean = false;
  idEliminar: number = 0;
  
  permisoCrear!: Promise<boolean>;
  permisoEditar!: Promise<boolean>;
  permisoEliminar!: Promise<boolean>;
  modulo: string = 'Notificaciones';
    
  constructor(private auth: AuthServices, private messageService: MessageService, private ms: MenuService, private router: Router, private sanitizer: DomSanitizer) {
  }

  ngOnInit() {
    this.permisoCrear = this.auth.tienePermiso(this.modulo, permiso.crear);
    this.permisoEditar = this.auth.tienePermiso(this.modulo, permiso.editar);
    this.permisoEliminar = this.auth.tienePermiso(this.modulo, permiso.eliminar);
  }
  
    async loadPages(event: TableLazyLoadEvent)  {
      this.loading = true;
      
      const page = (event.first || 0) / (event.rows || this.rowsPerPage) + 1;
      const pageSize = event.rows || this.rowsPerPage;
  
      let menusResponse = await this.ms.getOnDemand('notificaciones', page, pageSize, '', apis.Administrador);
      if (menusResponse) {
        let result: ResponseModel = menusResponse;
        if (result.error) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: result.dataError.message });
          this.loading = false;
          return;
        }
  
        let data: {value: any[], count: number} = result.data;
        this.pages = data.value as Notificacion[];
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
      this.router.navigate([`/notificaciones-crear`]);
    }
  
    edit(page: any) {
      this.router.navigate([`/notificaciones-editar/${page.id}`]);
    }
  
    async onToggleChange(data: any) {
      let notificacion: Notificacion = data;
      let responseActivation = await this.ms.putActivateDeactivate('notificaciones', data.id, apis.Administrador);
      if (responseActivation) {
        let result: ResponseModel = responseActivation;
        if (result.error) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: result.dataError.message });
          return;
        } else if (result.data) {
          if (!notificacion.estado) {
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
        this.ms.delete('notificaciones', this.idEliminar, apis.Administrador).then((response) => {
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

    sanitizarHtml(html: string): SafeHtml {
      return this.sanitizer.bypassSecurityTrustHtml(html);
    }

}
