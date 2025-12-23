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
import { Paginas } from '../../../../../models/paginas.model';
import { Menu, MenuModule } from 'primeng/menu';
import { permiso } from '../../../../../models/permiso';
import { AuthServices } from '../../../../../services/auth.service';

@Component({
  selector: 'app-paginas-consultar',
  standalone: true,
  templateUrl: './paginas-consultar.component.html',
  styleUrl: './paginas-consultar.component.css',
  imports: [TableModule, ButtonModule, TooltipModule, CommonModule, ConfirmDialogModule, ToastModule, InputSwitchModule, FormsModule, MsgBoxComponent, ButtonModule, MenuModule],
  providers: [ConfirmationService, MessageService]
})
export class PaginasConsultarComponent {
  @ViewChild('menu') menu!: Menu;
  pages: Paginas[] = [];
  pagina: Paginas | null = null;
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
  modulo: string  = 'Paginas';
    
  constructor(private auth: AuthServices, private messageService: MessageService, private ms: MenuService, private router: Router) {}

  ngOnInit() {
    this.permisoCrear = this.auth.tienePermiso(this.modulo, permiso.crear);
    this.permisoEditar = this.auth.tienePermiso(this.modulo, permiso.editar);
    this.permisoEliminar = this.auth.tienePermiso(this.modulo, permiso.eliminar);

    this.items = [
      { label: 'Carrusel', icon: 'pi pi-image', command: () => this.router.navigate(['/carrusel', this.idSeleccionado]) },
      { label: 'Documentos', icon: 'pi pi-file', command: () => this.router.navigate(['/documentos', this.idSeleccionado]) },
      { label: 'Noticias', icon: 'pi pi-book', command: () => this.router.navigate(['/noticias', this.idSeleccionado]) },
    ];
  }

  mostrarMenu(event: MouseEvent, id: number) {
    this.idSeleccionado = id;
    this.menu.toggle(event);
  }

  async loadPages(event: TableLazyLoadEvent)  {
    this.loading = true;
    
    const page = (event.first || 0) / (event.rows || this.rowsPerPage) + 1;
    const pageSize = event.rows || this.rowsPerPage;

    let menusResponse = await this.ms.getOnDemand('paginas', page, pageSize, '', apis.Administrador);
    if (menusResponse) {
      let result: ResponseModel = menusResponse;
      if (result.error) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: result.dataError.message });
        this.loading = false;
        return;
      }

      let data: {value: any[], count: number} = result.data;
      this.pages = data.value as Paginas[];
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
    this.router.navigate([`/paginas-crear`]);
  }

  edit(page: any) {
    this.router.navigate([`/paginas-editar/${page.id}`]);
  }

  async onToggleChange(data: any) {
    this.pagina = data;
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
        let responseActivation = await this.ms.putActivateDeactivate('paginas', this.pagina?.id ?? 0, apis.Administrador);
        if (responseActivation) {
          let result: ResponseModel = responseActivation;
          if (result.error) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: result.dataError.message });
            return;
          } else if (result.data) {
            if(this.pagina?.estado == true){
              const icono = document.getElementById(`icono-${this.pagina?.id}`) as HTMLImageElement;
              icono.src = 'iconos/enabled.png';
              this.messageService.add({ severity: 'error', summary: 'Éxito', detail: 'Registro inactivado correctamente' });
            } else {
              const icono = document.getElementById(`icono-${this.pagina?.id}`) as HTMLImageElement;
              icono.src = 'iconos/disabled.png';
              this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Registro activado correctamente' });
            }
          }
        }
      } else {
        this.ms.delete('paginas', this.idEliminar, apis.Administrador).then((response) => {
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

  cargarIcono(estado: boolean): string {
    return estado ? 'iconos/enabled.png' : 'iconos/disabled.png';
  }
}
