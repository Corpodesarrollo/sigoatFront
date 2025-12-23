import { Component } from '@angular/core';
import { apis } from '../../../../../models/apis.model';
import { ResponseModel } from '../../../../../models/response.model';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { RedesSociales } from '../../../../../models/redes-sociales.model';
import { AuthServices } from '../../../../../services/auth.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { MenuService } from '../../../../../services/menu.service';
import { Router } from '@angular/router';
import { Menus } from '../../../../../models/menus.model';
import { permiso } from '../../../../../models/permiso';
import { environment } from '../../../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { MsgBoxComponent } from '../../../../shared/msg-box/msg-box.component';
import { MsgBotones } from '../../../../../models/msgBotones.model';
import { MsgTipo } from '../../../../../models/msgTipo.model';
import { RedesSocialesService } from '../../../../../services/redesSociales.service';
import { redesSociales } from '../../../../../models/redesSociales';

@Component({
  selector: 'app-redes-sociales-consultar',
  standalone: true,
  templateUrl: './redes-sociales-consultar.component.html',
  styleUrl: './redes-sociales-consultar.component.css',
  imports: [TableModule, ButtonModule, TooltipModule, CommonModule, ConfirmDialogModule, ToastModule, InputSwitchModule, FormsModule, MsgBoxComponent],
  providers: [ConfirmationService, MessageService]
})
export class RedesSocialesConsultarComponent {

  pages: RedesSociales[] = [];
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
  modulo: string = 'redesSociales';

  constructor(private auth: AuthServices, private messageService: MessageService, private ms: RedesSocialesService, private router: Router) {
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

    let menusResponse = await this.ms.getOnDemand('redesSociales', page, pageSize, '', apis.Administrador);
    console.log(menusResponse);
    if (menusResponse) {
      let result: ResponseModel = menusResponse;
      if (result.error) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: result.dataError.message });
        this.loading = false;
        return;
      }

      let data: {value: any[], count: number} = result.data;
      this.pages = data.value as RedesSociales[];
      this.totalRecords = data.count; // Asumiendo que la respuesta contiene el total de registros
      this.loading = false;
    } else{
      this.loading = false;
      return;
    }
  }

  cargarUrl(id: number): string {
      return `${environment.urlMSAdministracion}RedesSociales/GetImg/${id}`;
  }

  validarEstado(estado: boolean): string {
    return !estado ? 'Activar' : 'Inactivar';
  }

  agregar() {
    this.router.navigate([`/redesSociales-crear`]);
  }

  edit(page: any) {
    this.router.navigate([`/redesSociales-editar/${page.id}`]);
  }

  async onToggleChange(data: any) {
    let responseActivation = await this.ms.putActivateDeactivate('redesSociales', data.id, apis.Seguridad);
    if (responseActivation) {
      let result: ResponseModel = responseActivation;
      if (result.error) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: result.dataError.message });
        return;
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
      this.ms.delete('redesSociales', this.idEliminar, apis.Administrador).then((response) => {
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

  cargarData(arg0: number): string {
    const redSocial = redesSociales.find((item: { id: number; }) => item.id === arg0);
    return redSocial ? redSocial.nombre.toLowerCase() : '';
  }
}
