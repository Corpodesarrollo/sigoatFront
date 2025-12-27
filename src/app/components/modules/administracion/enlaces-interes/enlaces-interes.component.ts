import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { apis } from '../../../../models/apis.model';
import { MsgBotones } from '../../../../models/msgBotones.model';
import { MsgTipo } from '../../../../models/msgTipo.model';
import { ResponseModel } from '../../../../models/response.model';
import { MsgBoxComponent } from '../../../shared/msg-box/msg-box.component';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { PaginasService } from '../../../../services/paginas.service';
import { EnlaceInteres } from '../../../../models/enlacesInteres.model';
import { EnlacesInteresService } from '../../../../services/enlacesInteres.service';
import { permiso } from '../../../../models/permiso';
import { AuthServices } from '../../../../services/auth.service';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'app-enlaces-interes',
  standalone: true,
  imports: [TableModule, ButtonModule, TooltipModule, CommonModule, ConfirmDialogModule, ToastModule, CheckboxModule,
    InputSwitchModule, FormsModule, MsgBoxComponent, DialogModule, InputTextModule, InputTextareaModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './enlaces-interes.component.html',
  styleUrl: './enlaces-interes.component.css'
})
export class EnlacesInteresComponent {
  enlaces: EnlaceInteres[] = [];
  totalRecords: number = 0;
  rowsPerPage: number = 10;
  loading: boolean = true;
  visible: boolean = false;
  msg: string = '';
  msgTipo: MsgTipo = MsgTipo.Question;
  msgBotones: MsgBotones = MsgBotones.EliminarCancelar;
  enlaceSeleccionado: EnlaceInteres | null = null;
  MsgTipo = MsgTipo;
  MsgBotones = MsgBotones;
  error: boolean = false;
  idEliminar: number = 0;
  tituloPagina: string = '';
  submitted: boolean = false;
  saving: boolean = false;
  displayModal: boolean = false;
  id: number | undefined;
  targetNewTab: boolean = false;
  urlError: string = '';
  validandoUrl: boolean = false;
  
  formulario: EnlaceInteres = {
    id: 0,
    idPagina: 0,
    titulo: '',
    descripcion: '',
    url: '',
    target: '_self',
    orden: null,
    estado: true
  };

  permisoCrear!: Promise<boolean>;
  permisoEditar!: Promise<boolean>;
  permisoEliminar!: Promise<boolean>;
  modulo: string = 'EnlacesInteres';

  constructor(
    private auth: AuthServices, 
    private messageService: MessageService, 
    private ms: EnlacesInteresService, 
    private ps: PaginasService, 
    private route: ActivatedRoute, 
    private router: Router
  ) {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      this.id = idParam ? +idParam : undefined;
    });
  }

  async ngOnInit() {
    this.permisoCrear = this.auth.tienePermiso(this.modulo, permiso.crear);
    console.log("Permiso Crear Enlaces de Interes:", await this.permisoCrear);
    this.permisoEditar = this.auth.tienePermiso(this.modulo, permiso.editar);
    this.permisoEliminar = this.auth.tienePermiso(this.modulo, permiso.eliminar);
    
    if (this.id !== undefined) {
      this.loading = true;
      let pagina = await this.ps.getById("paginas", this.id, apis.Administrador);
      if (pagina) {
        let result: ResponseModel = pagina;
        if (result.error) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: result.dataError.message });
          return;
        }
        this.tituloPagina = result.data.titulo;
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar la página.' });
      }

      let enlacesResponse = await this.ms.getAllById("enlacesInteres", this.id, apis.Administrador);
      if (enlacesResponse) {
        let result: ResponseModel = enlacesResponse;
        if (result.error) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: result.dataError.message });
          return;
        }
        
        this.enlaces = result.data;
        this.totalRecords = result.data.length;
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar los enlaces.' });
      }
    }
    this.loading = false;
    this.limpiar();
  }

  agregar() {
    this.limpiar();
    this.displayModal = true;
  }

  async editar(id: number) {
    this.limpiar();
    this.displayModal = true;
    let response = await this.ms.getById('enlacesInteres', id, apis.Administrador);
    if (response?.error) {
      console.error('Error al obtener el enlace:', response.error);
      return;
    } else {
      let enlace = response?.data as EnlaceInteres;
      this.formulario = { ...enlace };
      this.targetNewTab = enlace.target === '_blank';
    }
  }

  confirmDelete(event: Event, id: number) {
    this.visible = true;
    this.msgTipo = MsgTipo.Question;
    this.msgBotones = MsgBotones.EliminarCancelar;
    this.msg = '¿Desea eliminar este registro?';
    this.idEliminar = id;
  }

  onToggleChange(data: EnlaceInteres) {
    this.enlaceSeleccionado = data;
    this.msgTipo = MsgTipo.Question;
    this.msgBotones = MsgBotones.AceptarCancelar;
    this.msg = `¿Desea ${this.validarEstado(!data.estado)} este registro?`;
    this.visible = true;
    this.idEliminar = 0;
  }

  validarEstado(estado: boolean | undefined): string {
    return estado ? 'Activar' : 'Inactivar';
  }

  cargarIcono(estado: boolean | undefined): string {
    return estado ? 'iconos/enabled.png' : 'iconos/disabled.png';
  }

  async onHide(event: any): Promise<void> {
    this.visible = false;
    if (event == true) {
      if (this.idEliminar === 0 && this.enlaceSeleccionado) {
        // Activar/Inactivar
        let responseActivation = await this.ms.putActivateDeactivate('enlacesInteres', this.enlaceSeleccionado.id, apis.Administrador);
        if (responseActivation) {
          let result: ResponseModel = responseActivation;
          if (result.error) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: result.dataError.message });
            return;
          } else if (result.data) {
            const icono = document.getElementById(`icono-${this.enlaceSeleccionado.id}`) as HTMLImageElement;
            if (this.enlaceSeleccionado.estado) {
              icono.src = 'iconos/disabled.png';
              this.enlaceSeleccionado.estado = false;
              this.messageService.add({ severity: 'warn', summary: 'Éxito', detail: 'Registro inactivado correctamente' });
            } else {
              icono.src = 'iconos/enabled.png';
              this.enlaceSeleccionado.estado = true;
              this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Registro activado correctamente' });
            }
          }
        }
      } else {
        // Eliminar
        this.ms.delete('enlacesInteres', this.idEliminar, apis.Administrador).then((response) => {
          if (response) {
            let result: ResponseModel = response;
            if (result.error) {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: result.dataError.message });
            } else {
              this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Registro eliminado correctamente' });
              this.ngOnInit();
            }
          }
        });
      }
    }
  }

  async onSubmit() {
    this.submitted = true;
    if (this.validarCamposRequeridos() && !this.saving) {
      this.saving = true;
      
      // Asignar target según el checkbox
      this.formulario.target = this.targetNewTab ? '_blank' : '_self';
      this.formulario.idPagina = this.id;
      this.formulario.orden = this.formulario.orden ? Number(this.formulario.orden) : 0;

      if (this.formulario.id === 0) {
        // Crear nuevo enlace
        let response = await this.ms.post('enlacesInteres', this.formulario, apis.Administrador);
        if (response) {
          let result: ResponseModel = response;
          if (result.error) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: result.dataError.message });
            this.saving = false;
            return;
          }
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Enlace creado correctamente' });
          this.limpiar();
          this.ngOnInit();
        }
      } else {
        // Actualizar enlace existente
        let response = await this.ms.put('enlacesInteres', this.formulario, apis.Administrador);
        if (response) {
          let result: ResponseModel = response;
          if (result.error) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: result.dataError.message });
            this.saving = false;
            return;
          }
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Enlace actualizado correctamente' });
          this.limpiar();
          this.ngOnInit();
        }
      }
    }
  }

  validarCamposRequeridos(): boolean {
    this.formulario.idPagina = this.id;

    if (!this.formulario.titulo || this.formulario.titulo.toString().trim() === '') {
      console.log('Campo requerido vacío: titulo');
      return false;
    }

    if (!this.formulario.url || this.formulario.url.toString().trim() === '') {
      console.log('Campo requerido vacío: url');
      return false;
    }

    if (this.urlError) {
      console.log('Error en la URL:', this.urlError);
      return false;
    }

    return true;
  }

  limpiar(): void {
    this.displayModal = false;
    this.formulario = {
      id: 0,
      idPagina: this.id || 0,
      titulo: '',
      descripcion: '',
      url: '',
      target: '_self',
      orden: null,
      estado: true
    };
    this.submitted = false;
    this.saving = false;
    this.targetNewTab = false;
    this.urlError = '';
    this.validandoUrl = false;
  }

  validarUrl(): void {
    const url = this.formulario.url?.trim();
    this.urlError = '';
    
    if (!url) return;

    // Validar formato de URL
    const urlPattern = /^(https?:\/\/)[^\s/$.?#].[^\s]*$/i;
    if (!urlPattern.test(url)) {
      this.urlError = 'El formato de la URL no es válido. Debe comenzar con http:// o https://';
      return;
    }

    this.validandoUrl = true;
    
    fetch(url, { method: 'HEAD', mode: 'no-cors' })
      .then(() => {
        this.urlError = '';
        this.validandoUrl = false;
      })
      .catch(() => {
        this.urlError = 'No se pudo verificar el enlace. Asegúrese de que la URL sea correcta.';
        this.validandoUrl = false;
      });
  }

  anterior(): void {
    window.history.back();
  }

  cambiarOrden(id: number, tipo: string): void {
    this.ms.putUpDown('enlacesInteres', `${id}/${tipo}`, apis.Administrador).then((response) => {
      if (response) {
        let result: ResponseModel = response;
        if (result.error) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: result.dataError.message });
        } else {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Orden cambiado correctamente' });
          this.ngOnInit();
        }
      }
    });
  }
}
