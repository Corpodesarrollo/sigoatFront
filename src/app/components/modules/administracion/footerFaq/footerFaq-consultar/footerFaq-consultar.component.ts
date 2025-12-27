import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TableModule, TableLazyLoadEvent } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { apis } from '../../../../../models/apis.model';
import { MsgBotones } from '../../../../../models/msgBotones.model';
import { MsgTipo } from '../../../../../models/msgTipo.model';
import { ResponseModel } from '../../../../../models/response.model';
import { MenuService } from '../../../../../services/menu.service';
import { MsgBoxComponent } from '../../../../shared/msg-box/msg-box.component';
import { Menu, MenuModule } from 'primeng/menu';
import { permiso } from '../../../../../models/permiso';
import { AuthServices } from '../../../../../services/auth.service';
import { FooterFaq } from '../../../../../models/footerFaq.model';
import { FooterFaqService } from '../../../../../services/footerFaq.service';

@Component({
  selector: 'app-footerFaq-consultar',
  standalone: true,
  templateUrl: './footerFaq-consultar.component.html',
  styleUrl: './footerFaq-consultar.component.css',
  imports: [TableModule, ButtonModule, TooltipModule, CommonModule, ConfirmDialogModule, ToastModule, InputSwitchModule, FormsModule, MsgBoxComponent, ButtonModule, MenuModule],
  providers: [ConfirmationService, MessageService]
})
export class FooterFaqConsultarComponent {
  @ViewChild('menu') menu!: Menu;
  pages: FooterFaq[] = [];
  footer: FooterFaq | null = null;
  totalRecords: number = 0;
  rowsPerPage: number = 10;
  loading: boolean = true;
  visible: boolean = false;
  msg: string = '';
  MsgTipo = MsgTipo;
  MsgBotones = MsgBotones;
  msgTipo: MsgTipo = MsgTipo.Question;
  msgBotones: MsgBotones = MsgBotones.EliminarCancelar;
  error: boolean = false;
  idEliminar: number = 0;
  items: MenuItem[] = [];
  idSeleccionado: number = 0;
  estado: boolean = false;
  value: boolean = false;
  permisoCrear!: Promise<boolean>;
  permisoEditar!: Promise<boolean>;
  permisoEliminar!: Promise<boolean>;
  modulo: string  = 'FooterFaq';
    
  constructor(private auth: AuthServices, private messageService: MessageService, private ms: MenuService, private faqService: FooterFaqService, private router: Router) {}

  ngOnInit() {
    this.permisoCrear = this.auth.tienePermiso(this.modulo, permiso.crear);
    this.permisoEditar = this.auth.tienePermiso(this.modulo, permiso.editar);
    this.permisoEliminar = this.auth.tienePermiso(this.modulo, permiso.eliminar);
  }

  mostrarMenu(event: MouseEvent, id: number) {
    this.idSeleccionado = id;
    this.menu.toggle(event);
  }

  async loadPages(event: TableLazyLoadEvent)  {
    this.loading = true;
    
    const page = (event.first || 0) / (event.rows || this.rowsPerPage) + 1;
    const pageSize = event.rows || this.rowsPerPage;

    let menusResponse = await this.ms.getOnDemand('footerFaq', page, pageSize, '', apis.Administrador);
    if (menusResponse) {
      let result: ResponseModel = menusResponse;
      if (result.error) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: result.dataError.message });
        this.loading = false;
        return;
      }

      let data: {value: any[], count: number} = result.data;
      this.pages = data.value as FooterFaq[];
      this.totalRecords = data.count; // Asumiendo que la respuesta contiene el total de registros
      this.loading = false;
    } else{
      this.loading = false;
      return;
    }
  }

  validarEstado(estado: boolean): string {
    return estado ? 'Activar' : 'Inactivar';
  }

  agregar() {
    this.router.navigate([`/footerFaq-crear`]);
  }

  edit(page: any) {
    this.router.navigate([`/footerFaq-editar/${page.id}`]);
  }

  async onToggleChange(data: any) {
    this.footer = data;
    this.msgTipo = MsgTipo.Question;
    this.msgBotones = MsgBotones.AceptarCancelar;
    this.msg = `¿Desea ${this.validarEstado(!data.estado)} este registro?`;
    this.visible = true;
    this.idEliminar = 0;
  }

  confirmDelete(event: Event, id: number) {
    this.visible = true;
    this.msgTipo = MsgTipo.Question;
    this.msgBotones = MsgBotones.EliminarCancelar;
    this.msg = '¿Desea eliminar este registro?';
    this.idEliminar = id;
  }

  async onHide(event: any): Promise<void> {
    this.visible = false;
    if (event == true) {
      if(this.idEliminar == 0){
        let responseActivation = await this.ms.putActivateDeactivate('footerFaq', this.footer?.id ?? 0, apis.Administrador);
        if (responseActivation) {
          let result: ResponseModel = responseActivation;
          if (result.error) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: result.dataError.message });
            return;
          } else if (result.data) {
            if(this.footer?.estado == true){
              const icono = document.getElementById(`icono-${this.footer?.id}`) as HTMLImageElement;
              icono.src = 'iconos/enabled.png';
              this.messageService.add({ severity: 'error', summary: 'Éxito', detail: 'Registro inactivado correctamente' });
            } else {
              const icono = document.getElementById(`icono-${this.footer?.id}`) as HTMLImageElement;
              icono.src = 'iconos/disabled.png';
              this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Registro activado correctamente' });
            }
          }
        }
      } else {
        this.ms.delete('footerFaq', this.idEliminar, apis.Administrador).then((response) => {
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
    } else {
      if(this.idEliminar == 0){
        this.loadPages({ first: 0, rows: this.rowsPerPage } as TableLazyLoadEvent);
      }
    }
  }

  cambiarOrden(id: number, tipo: string) {
    this.faqService.putUpDown('footerFaq', `${id}/${tipo}`, apis.Administrador).then((response) => {
      if (response) {
        let result: ResponseModel = response;
        if (result.error) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: result.dataError.message });
        } else {
          this.loadPages({ first: 0, rows: this.rowsPerPage } as TableLazyLoadEvent);
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Orden actualizado correctamente' });
        }
      }
    });
  }

  cargarIcono(estado: boolean): string {
    return estado ? 'iconos/enabled.png' : 'iconos/disabled.png';
  }
}
