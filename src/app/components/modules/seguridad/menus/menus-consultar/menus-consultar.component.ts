import { Component } from '@angular/core';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { MenuService } from '../../../../../services/menu.service';
import { Menus } from '../../../../../models/menus.model';
import { apis } from '../../../../../models/apis.model';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';


@Component({
  selector: 'app-menus-consultar',
  standalone: true,
  imports: [TableModule, ButtonModule, TooltipModule, CommonModule, ConfirmDialog, ToastModule],
  templateUrl: './menus-consultar.component.html',
  styleUrl: './menus-consultar.component.css',
  providers: [ConfirmationService, MessageService]
})
export class MenusConsultarComponent {
  pages: Menus[] = [];
  totalRecords: number = 0;
  rowsPerPage: number = 10;
  loading: boolean = true;

  constructor(private ms: MenuService) {}

  ngOnInit() {
    // Carga inicial puede estar vacía o cargar primera página
  }

  async loadPages(event: TableLazyLoadEvent)  {
    this.loading = true;
    
    const page = (event.first || 0) / (event.rows || this.rowsPerPage) + 1;
    const pageSize = event.rows || this.rowsPerPage;

    let menusResponse = await this.ms.getOnDemand<any>('menus', page, pageSize, '', apis.Seguridad);
    if (menusResponse) {
      console.log(menusResponse);
      let result = menusResponse as {value: any[], count: number};
      this.pages = result.value as Menus[];
      this.totalRecords = result.count; // Asumiendo que la respuesta contiene el total de registros
      this.loading = false;
    } else{
      this.loading = false;
      return;
    }
  }

  toggleStatus(page: any) {
    const newStatus = page.estado === 'activo' ? 'inactivo' : 'activo';
    const action = newStatus === 'activo' ? 'activada' : 'inactivada';
    
    // this.pageService.updatePageStatus(page.id, newStatus).subscribe({
    //   next: () => {
    //     page.estado = newStatus;
    //     this.messageService.add({
    //       severity: 'success',
    //       summary: 'Éxito',
    //       detail: `Página ${action} correctamente`,
    //       life: 3000
    //     });
    //   },
    //   error: (err) => {
    //     console.error(err);
    //     this.messageService.add({
    //       severity: 'error',
    //       summary: 'Error',
    //       detail: `No se pudo ${action} la página`,
    //       life: 3000
    //     });
    //   }
    // });
  }

  editPage(page: any) {
    // Lógica para editar la página
    console.log('Editar página:', page);
    // Aquí puedes abrir un diálogo/modal de edición
    // this.messageService.add({
    //   severity: 'info',
    //   summary: 'Editar',
    //   detail: `Editando página: ${page.titulo}`
    // });
  }

  deletePage(page: any) {
    // this.confirmationService.confirm({
    //   message: `¿Estás seguro de eliminar "${page.titulo}"?`,
    //   header: 'Confirmar eliminación',
    //   icon: 'pi pi-exclamation-triangle',
    //   acceptLabel: 'Sí, eliminar',
    //   rejectLabel: 'Cancelar',
    //   accept: () => {
    //     // Lógica para eliminar la página
    //     this.messageService.add({
    //       severity: 'success',
    //       summary: 'Eliminado',
    //       detail: `Página "${page.titulo}" eliminada`,
    //       life: 3000
    //     });
    //     // Aquí deberías llamar a tu servicio para eliminar
    //   }
    }
}
