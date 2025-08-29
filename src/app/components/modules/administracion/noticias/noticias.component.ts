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
import { Paginas } from '../../../../models/paginas.model';
import { ResponseModel } from '../../../../models/response.model';
import { MsgBoxComponent } from '../../../shared/msg-box/msg-box.component';
import { FileUploadModule } from 'primeng/fileupload';
import { StepsComponent } from '../../../shared/steps/steps.component';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { Anexos } from '../../../../models/anexos.model';
import { Attachment } from '../../../../models/attachment.model';
import { PaginasService } from '../../../../services/paginas.services';
import { Noticias } from '../../../../models/noticias.model';
import { NoticiasServices } from '../../../../services/noticias.services';
import { CalendarModule } from 'primeng/calendar';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { permiso } from '../../../../models/permiso';
import { AuthServices } from '../../../../services/auth.service';
import { ViewerComponent } from "../../../shared/viewer/viewer.component";

@Component({
  selector: 'app-noticias',
  standalone: true,
  imports: [TableModule, ButtonModule, TooltipModule, CommonModule, ConfirmDialogModule, ToastModule,
    InputSwitchModule, FormsModule, MsgBoxComponent, DialogModule, FileUploadModule, InputTextModule, StepsComponent, CalendarModule, InputTextareaModule, ViewerComponent],
  providers: [ConfirmationService, MessageService],
  templateUrl: './noticias.component.html',
  styleUrl: './noticias.component.css'
})
export class NoticiasComponent {
  pages: Noticias[] = [];
  totalRecords: number = 0;
  rowsPerPage: number = 10;
  loading: boolean = true;
  visible: boolean = false;
  visible2: boolean = false;
  display: boolean = false;
  msg: string = '';
  MsgTipo = MsgTipo;
  MsgBotones = MsgBotones;
  error: boolean = false;
  idEliminar: number = 0;
  tituloPagina: string = '';
  submitted: boolean = false;
  saving: boolean = false;
  displayViewer: boolean = false;
  displayModal: boolean = false;
  imageUrl = '';
  fileToUpload: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  id: number | undefined;
  
  formulario: Noticias = {
    id: 0,
    titulo: '',
    detalle: '',
    fecha: null
  };

  mensajeError: string = '';
  nombre: string = '';
  archivoSeleccionado: Attachment | null = null;

  permisoCrear!: Promise<boolean>;
  permisoEditar!: Promise<boolean>;
  permisoEliminar!: Promise<boolean>;
  modulo: string = 'Noticias';

  constructor(private auth: AuthServices, private messageService: MessageService, private ms: NoticiasServices, private ps: PaginasService, private route: ActivatedRoute, private router: Router) {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      this.id = idParam ? +idParam : undefined;
    });
  }

  async ngOnInit() {
    this.permisoCrear = this.auth.tienePermiso(this.modulo, permiso.crear);
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

      let noticia = await this.ms.getAllById("noticias", this.id, apis.Administrador);
      console.log(noticia);
      if (noticia) {
        let result: ResponseModel = noticia;
        if (result.error) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: result.dataError.message });
          return;
        }
        
        this.pages = result.data;
        this.totalRecords = result.data.length;
        console.log(this.pages);
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar los documentos.' });
      }
    }
    this.loading = false;

    this.limpiar();
  }

  limpiar() {
    this.formulario = {
      id: 0,
      titulo: '',
      detalle: '',
      fecha: null
    };
    this.submitted = false;
    this.saving = false;
    this.displayModal = false;
    this.imageUrl = '';
    this.fileToUpload = null;
    this.imagePreview = null;
    this.mensajeError = '';
    this.nombre = '';
    this.archivoSeleccionado = null;
  }

  agregar() {
    this.displayModal = true;
    console.log('Abrir modal para agregar nueva noticias');
  }

  detalles(id:number) {
    this.router.navigate([`detallesNoticias/${id}/${this.id}`]);
  }

  async editar(id:number) {
    this.displayModal = true;
    let respose = await this.ms.getById('noticias', id, apis.Administrador);
    if(respose?.error) {
      console.error('Error al obtener la noticia:', respose.error);
      return;
    } else {
      let noticia = respose?.data as Noticias;
      this.formulario = {
        ...noticia,
        fecha: noticia.fecha ? new Date(noticia.fecha) : null
      };
      console.log('Noticia obtenida:', this.formulario);
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
      this.ms.delete('noticias', this.idEliminar, apis.Administrador).then((response) => {
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

  show() {
    this.display = true;
  }

  async onSubmit() {
    this.submitted = true;
    if (this.validarCamposRequeridos() && !this.saving) {
      this.saving = true;
      let response;
      if (this.formulario.id === 0) {
        response = await this.ms.post<Noticias>('noticias', this.formulario, apis.Administrador);
      } else {
        response = await this.ms.put<Noticias>('noticias', this.formulario, apis.Administrador);
      }
      if (response) {
        if (!response.error) {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Archivo subido correctamente' });
          this.displayModal = false;
          this.ngOnInit(); 
          
        } else {
          if (response) {
            console.log(response.dataError);
          }
        }
  
        this.error = !!response?.error;
      }
    }
    this.saving = false;
  }

  anterior(): void {
    this.router.navigate([`/documentos/${this.id}`]);
  }

  validarCamposRequeridos(): boolean {
    let camposAValidar: (string | null | Date | undefined)[] = [];
    this.formulario.idPagina = this.id;

    camposAValidar = [
      this.formulario.titulo,
      this.formulario.fecha,
    ];
    
    let pos = 0;
    for (const campo of camposAValidar) {
      pos++;
      if (!campo || campo.toString().trim() === '' || campo.toString() === '0') {
        console.log('Campo requerido vacío:', campo);
        console.log('Posición:', pos);
        return false;
      }
    }

    return true;
  }
}
