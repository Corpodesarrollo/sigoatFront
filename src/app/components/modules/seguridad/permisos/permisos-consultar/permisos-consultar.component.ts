import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { MsgBoxComponent } from '../../../../shared/msg-box/msg-box.component';
import { PermisosService } from '../../../../../services/permisos.service';
import { Router } from '@angular/router';
import { MsgTipo } from '../../../../../models/msgTipo.model';
import { MsgBotones } from '../../../../../models/msgBotones.model';
import { PermisosRol } from '../../../../../models/permisosRol.model';
import { apis } from '../../../../../models/apis.model';
import { ResponseModel } from '../../../../../models/response.model';
import { Menus } from '../../../../../models/menus.model';
import { Parametricas } from '../../../../../models/parametricas.model';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'app-permisos-consultar',
  standalone: true,
  imports: [CheckboxModule, DropdownModule, TableModule, ButtonModule, TooltipModule, CommonModule, ConfirmDialogModule, ToastModule, InputSwitchModule, FormsModule, MsgBoxComponent],
  providers: [ConfirmationService, MessageService],
  templateUrl: './permisos-consultar.component.html',
  styleUrl: './permisos-consultar.component.css'
})
export class PermisosConsultarComponent {

  pages: PermisosRol[] = [];
  totalRecords: number = 0;
  rowsPerPage: number = 10;
  loading: boolean = true;
  visible: boolean = false;
  msg: string = '';
  MsgTipo = MsgTipo;
  MsgBotones = MsgBotones;
  error: boolean = false;
  idRol: number = 0;

  roles: Parametricas[] = [];
  selectedRol: Parametricas | undefined;
  isLoadingRoles: boolean = true;

  checkAll = {
    consultar: false,
    crear: false,
    editar: false,
    eliminar: false
  };

  indeterminate = {
    consultar: false,
    crear: false,
    editar: false,
    eliminar: false
  };

  constructor(private messageService: MessageService, private ms: PermisosService, private router: Router) {}

  async ngOnInit() {
    let response = await this.ms.getAll('roles', apis.Seguridad);
    if (response) {
      let result: ResponseModel = response;
      if (!result.error) {
        this.roles = result.data;
        //seleccionar el primer rol por defecto
        if (this.roles.length > 0) {
          this.selectedRol = this.roles[0];
          this.idRol = this.selectedRol.id ?? 0;
          await this.loadPages(this.idRol);
        }
      }
    }
    
    this.isLoadingRoles = false;
  }
  
  async loadPages(id: number)  {
      this.loading = true;
  
      let response = await this.ms.getAllByRol(this.idRol);
      if (response) {
        let result: ResponseModel = response;
        if (result.error) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: result.dataError.message });
          this.loading = false;
          return;
        }
        
        this.pages = result.data as PermisosRol[];
        this.totalRecords = this.pages.length; 
        this.loading = false;
      } else{
        this.loading = false;
        return;
      }
    }

    onRolChange($event: any) {
      this.idRol = this.selectedRol?.id ?? 0;
      this.loadPages(this.idRol);
    }

    async onPermisoChange(page: any, parm: 'consultar' | 'crear' | 'editar' | 'eliminar') {
      let data = {
        idRol: this.idRol,
        idMenu: page.idMenu,
        permiso: parm
      };

      let responseActivation = await this.ms.putActive('permisos', data, apis.Seguridad);
      if (responseActivation) {
        let result: ResponseModel = responseActivation;
        if (result.error) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: result.dataError.message });
          return;
        } else if (result.data) {
          if (!result.data) {
            //this.messageService.add({ severity: 'error', summary: 'Éxito', detail: 'Permiso inactivado correctamente' });
          } else {
            //this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Permiso activado correctamente' });
          }
        }
      }
    }
}
