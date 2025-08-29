import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { apis } from '../../../../../models/apis.model';
import { Menus } from '../../../../../models/menus.model';
import { MsgBotones } from '../../../../../models/msgBotones.model';
import { MsgTipo } from '../../../../../models/msgTipo.model';
import { ResponseModel } from '../../../../../models/response.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { MsgBoxComponent } from '../../../../shared/msg-box/msg-box.component';
import { RolesService } from '../../../../../services/roles.services';
import { Roles } from '../../../../../models/roles.model';
import { AuthServices } from '../../../../../services/auth.service';
import { permiso } from '../../../../../models/permiso';

@Component({
  selector: 'app-roles-consultar',
  standalone: true,
  imports: [TableModule, ButtonModule, TooltipModule, CommonModule, ConfirmDialogModule, ToastModule, InputSwitchModule, FormsModule, MsgBoxComponent],
  providers: [MessageService],
  templateUrl: './roles-consultar.component.html',
  styleUrl: './roles-consultar.component.css'
})
export class RolesConsultarComponent {
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
  
  permisoCrear!: Promise<boolean>;
  permisoEditar!: Promise<boolean>;
  permisoEliminar!: Promise<boolean>;
  modulo: string = 'Roles';
  
    constructor(private auth: AuthServices, private messageService: MessageService, private ms: RolesService, private router: Router) {}
  
    ngOnInit() {
        this.permisoCrear = this.auth.tienePermiso(this.modulo, permiso.crear);
        this.permisoEditar = this.auth.tienePermiso(this.modulo, permiso.editar);
        this.permisoEliminar = this.auth.tienePermiso(this.modulo, permiso.eliminar);
      }
  
    async loadPages(event: TableLazyLoadEvent)  {
      this.loading = true;
      
      const page = (event.first || 0) / (event.rows || this.rowsPerPage) + 1;
      const pageSize = event.rows || this.rowsPerPage;
  
      let rolesResponse = await this.ms.getOnDemand('roles', page, pageSize, '', apis.Seguridad);
      if (rolesResponse) {
        let result: ResponseModel = rolesResponse;
        if (result.error) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: result.dataError.message });
          this.loading = false;
          return;
        }
  
        let data: {value: any[], count: number} = result.data;
        this.pages = data.value as Roles[];
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
      this.router.navigate([`/roles-crear`]);
    }
  
    edit(page: any) {
      this.router.navigate([`/roles-editar/${page.id}`]);
    }
  
    async onToggleChange(data: any) {
      let menu: Roles = data;
      let responseActivation = await this.ms.putActivateDeactivate('roles', data.id, apis.Seguridad);
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
        this.ms.delete('roles', this.idEliminar, apis.Seguridad).then((response) => {
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
