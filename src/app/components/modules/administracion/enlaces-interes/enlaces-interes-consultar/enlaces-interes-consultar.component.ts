import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService, MessageService } from 'primeng/api';
import { apis } from '../../../../../models/apis.model';
import { ResponseModel } from '../../../../../models/response.model';
import { EnlaceInteres } from '../../../../../models/enlacesInteres.model';
import { EnlacesInteresService } from '../../../../../services/enlacesInteres.service';
import { MsgBoxComponent } from '../../../../shared/msg-box/msg-box.component';

@Component({
  selector: 'app-enlaces-interes-consultar',
  standalone: true,
  imports: [
    CommonModule, FormsModule, InputTextModule, ButtonModule, 
    TableModule, ToolbarModule, TooltipModule, ToastModule, 
    ConfirmDialogModule, TagModule
  ],
  templateUrl: './enlaces-interes-consultar.component.html',
  styleUrl: './enlaces-interes-consultar.component.css',
  providers: [ConfirmationService, MessageService]
})
export class EnlacesInteresConsultarComponent {
  enlaces: EnlaceInteres[] = [];
  enlacesFiltrados: EnlaceInteres[] = [];
  valorBusqueda: string = '';
  cargando: boolean = false;

  constructor(
    private enlacesService: EnlacesInteresService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.cargarEnlaces();
  }

  async cargarEnlaces(): Promise<void> {
    this.cargando = true;
    try {
      const response = await this.enlacesService.getAll('enlacesInteres', apis.Administrador);
      if (response && !response.error) {
        this.enlaces = response.data;
        this.enlacesFiltrados = [...this.enlaces];
        this.ordenarPorOrden();
      } else {
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Error', 
          detail: 'No se pudieron cargar los enlaces de interés.' 
        });
      }
    } catch (error) {
      this.messageService.add({ 
        severity: 'error', 
        summary: 'Error', 
        detail: 'Error al cargar los enlaces de interés.' 
      });
    } finally {
      this.cargando = false;
    }
  }

  filtrarEnlaces(): void {
    if (!this.valorBusqueda.trim()) {
      this.enlacesFiltrados = [...this.enlaces];
    } else {
      const filtro = this.valorBusqueda.toLowerCase().trim();
      this.enlacesFiltrados = this.enlaces.filter(enlace => 
        enlace.titulo.toLowerCase().includes(filtro) ||
        (enlace.descripcion && enlace.descripcion.toLowerCase().includes(filtro)) ||
        enlace.url.toLowerCase().includes(filtro)
      );
    }
    this.ordenarPorOrden();
  }

  private ordenarPorOrden(): void {
    this.enlacesFiltrados.sort((a, b) => (a.orden || 0) - (b.orden || 0));
  }

  crear(): void {
    this.router.navigate(['/enlaces-interes/crear']);
  }

  editar(enlace: EnlaceInteres): void {
    this.router.navigate(['/enlaces-interes/editar', enlace.id]);
  }

  confirmarEliminar(enlace: EnlaceInteres): void {
    this.confirmationService.confirm({
      message: `¿Está seguro de eliminar el enlace "${enlace.titulo}"?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.eliminar(enlace.id);
      }
    });
  }

  async eliminar(id: number): Promise<void> {
    try {
      const response = await this.enlacesService.delete('enlacesInteres', id, apis.Administrador);
      if (response && !response.error) {
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Éxito', 
          detail: 'Enlace eliminado correctamente.' 
        });
        await this.cargarEnlaces();
      } else {
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Error', 
          detail: response?.dataError?.message || 'No se pudo eliminar el enlace.' 
        });
      }
    } catch (error) {
      this.messageService.add({ 
        severity: 'error', 
        summary: 'Error', 
        detail: 'Error al eliminar el enlace.' 
      });
    }
  }

  async cambiarEstado(enlace: EnlaceInteres): Promise<void> {
    try {
      const response = await this.enlacesService.putActivateDeactivate('enlacesInteres', enlace.id, apis.Administrador);
      if (response && !response.error) {
        enlace.estado = !enlace.estado;
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Éxito', 
          detail: `Enlace ${enlace.estado ? 'activado' : 'desactivado'} correctamente.` 
        });
      } else {
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Error', 
          detail: 'No se pudo cambiar el estado del enlace.' 
        });
      }
    } catch (error) {
      this.messageService.add({ 
        severity: 'error', 
        summary: 'Error', 
        detail: 'Error al cambiar el estado del enlace.' 
      });
    }
  }

  async moverOrden(enlace: EnlaceInteres, direccion: 'up' | 'down'): Promise<void> {
    const indiceActual = this.enlaces.findIndex(e => e.id === enlace.id);
    if (indiceActual === -1) return;

    let indiceDestino: number;
    if (direccion === 'up' && indiceActual > 0) {
      indiceDestino = indiceActual - 1;
    } else if (direccion === 'down' && indiceActual < this.enlaces.length - 1) {
      indiceDestino = indiceActual + 1;
    } else {
      return; // No se puede mover
    }

    try {
      const enlaceDestino = this.enlaces[indiceDestino];
      const ordenTemporal = enlace.orden;
      enlace.orden = enlaceDestino.orden;
      enlaceDestino.orden = ordenTemporal;

      // Actualizar en el servidor
      const movimientoData = `${enlace.id},${enlaceDestino.id}`;
      const response = await this.enlacesService.putUpDown('enlacesInteres', movimientoData, apis.Administrador);
      
      if (response && !response.error) {
        await this.cargarEnlaces();
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Éxito', 
          detail: 'Orden actualizado correctamente.' 
        });
      } else {
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Error', 
          detail: 'No se pudo actualizar el orden.' 
        });
        await this.cargarEnlaces(); // Recargar para revertir cambios
      }
    } catch (error) {
      this.messageService.add({ 
        severity: 'error', 
        summary: 'Error', 
        detail: 'Error al actualizar el orden.' 
      });
      await this.cargarEnlaces(); // Recargar para revertir cambios
    }
  }

  abrirEnlace(url: string, target: string): void {
    if (target === '_blank' || target === 'external') {
      window.open(url, '_blank');
    } else {
      window.open(url, '_self');
    }
  }

  getSeverityByEstado(estado: boolean): "success" | "secondary" | "info" | "warning" | "danger" | "contrast" | undefined {
    return estado ? 'success' : 'secondary';
  }

  getTargetLabel(target: string | null): string {
    return target === '_blank' || target === 'external' ? 'Externo' : 'Interno';
  }
}