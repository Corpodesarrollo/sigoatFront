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
import { MenuService } from '../../../../../services/menu.services';
import { MsgBoxComponent } from '../../../../shared/msg-box/msg-box.component';
import { Paginas } from '../../../../../models/paginas.model';
import { Menu, MenuModule } from 'primeng/menu';

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
  totalRecords: number = 0;
  rowsPerPage: number = 10;
  loading: boolean = true;
  visible: boolean = false;
  msg: string = '';
  MsgTipo = MsgTipo;
  MsgBotones = MsgBotones;
  error: boolean = false;
  idEliminar: number = 0;
  items: MenuItem[] = [];
  idSeleccionado: number = 0;
    
  constructor(private messageService: MessageService, private ms: MenuService, private router: Router) {}

  ngOnInit() {
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
    return !estado ? 'Activar' : 'Inactivar';
  }

  agregar() {
    this.router.navigate([`/paginas-crear`]);
  }

  edit(page: any) {
    this.router.navigate([`/paginas-editar/${page.id}`]);
  }

  async onToggleChange(data: any) {
    let pagina: Paginas = data;
    let responseActivation = await this.ms.putActivateDeactivate('paginas', data.id, apis.Administrador);
    if (responseActivation) {
      let result: ResponseModel = responseActivation;
      if (result.error) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: result.dataError.message });
        return;
      } else if (result.data) {
        if (!pagina.estado) {
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
  }
}
