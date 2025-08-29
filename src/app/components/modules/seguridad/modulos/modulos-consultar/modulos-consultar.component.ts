import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
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
import { Modulos } from '../../../../../models/modulos.model';
import { ModulosService } from '../../../../../services/modulos.services';
import { permiso } from '../../../../../models/permiso';
import { AuthServices } from '../../../../../services/auth.service';

@Component({
  selector: 'app-modulos-consultar',
  standalone: true,
  imports: [TableModule, ButtonModule, TooltipModule, CommonModule, ConfirmDialogModule, ToastModule, InputSwitchModule, FormsModule, MsgBoxComponent],
  templateUrl: './modulos-consultar.component.html',
  styleUrl: './modulos-consultar.component.css',
  providers: [ConfirmationService, MessageService]
})
export class ModulosConsultarComponent {
  pages: Modulos[] = [];
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
  modulo: string = 'Modulos';
  
    constructor(private auth: AuthServices, private confirmationService: ConfirmationService, private messageService: MessageService, private ms: ModulosService, private router: Router) {}
  
    ngOnInit() {
        this.permisoCrear = this.auth.tienePermiso(this.modulo, permiso.crear);
        this.permisoEditar = this.auth.tienePermiso(this.modulo, permiso.editar);
        this.permisoEliminar = this.auth.tienePermiso(this.modulo, permiso.eliminar);
      }
  
    async loadPages(event: TableLazyLoadEvent)  {
      this.loading = true;
      
      const page = (event.first || 0) / (event.rows || this.rowsPerPage) + 1;
      const pageSize = event.rows || this.rowsPerPage;
  
      let menusResponse = await this.ms.getOnDemand('modulos', page, pageSize, '', apis.Seguridad);
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
      this.router.navigate([`/modulos-crear`]);
    }
  
    edit(page: any) {
      this.router.navigate([`/modulos-editar/${page.id}`]);
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
        this.ms.delete('modulos', this.idEliminar, apis.Seguridad).then((response) => {
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
