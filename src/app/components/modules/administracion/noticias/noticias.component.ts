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
import { PaginasService } from '../../../../services/paginas.service';
import { Noticias } from '../../../../models/noticias.model';
import { environment } from '../../../../../environments/environment';
import { NoticiasServices } from '../../../../services/noticias.service';
import { CalendarModule } from 'primeng/calendar';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { permiso } from '../../../../models/permiso';
import { AuthServices } from '../../../../services/auth.service';
import { ViewerComponent } from "../../../shared/viewer/viewer.component";
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'app-noticias',
  standalone: true,
  imports: [TableModule, ButtonModule, TooltipModule, CommonModule, ConfirmDialogModule, ToastModule, CheckboxModule,
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
  imagenPreview: string | null = null;
  id: number | undefined;
  targetNewTab: boolean = false;
  enlaceError: string = '';
  urlRecursoError: string = '';
  validandoEnlace: boolean = false;
  validandoUrlRecurso: boolean = false;
  
  formulario: Noticias = {
    id: 0,
    idPagina: 0,
    titulo: '',
    resumen: '',
    enlace: '',
    target: '',
    posicion: 1,
    idImagen: null,
    imagen: null,
    mimeType: null,
    urlRecurso: '',
    orden: null,
    estado: true,
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
      idPagina: 0,
      titulo: '',
      resumen: '',
      enlace: '',
      target: '',
      posicion: 1,
      idImagen: null,
      imagen: null,
      mimeType: null,
      urlRecurso: '',
      orden: null,
      estado: true,
      fecha: new Date()
    };
    this.submitted = false;
    this.saving = false;
    this.displayModal = false;
    this.imageUrl = '';
    this.fileToUpload = null;
    this.imagePreview = null;
    this.imagenPreview = null;
    this.mensajeError = '';
    this.nombre = '';
    this.archivoSeleccionado = null;
    this.enlaceError = '';
    this.urlRecursoError = '';
    this.validandoEnlace = false;
    this.validandoUrlRecurso = false;
    this.targetNewTab = false;
  }

  agregar() {
    this.limpiar();
    this.displayModal = true;
    console.log('Abrir modal para agregar nueva noticias');
  }

  detalles(id:number) {
    this.router.navigate([`detallesNoticias/${id}/${this.id}`]);
  }

  async editar(id:number) {
    this.limpiar();
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
      
      // Precargar imagen en el preview si existe
      if (noticia.imagen && noticia.imagen.file && noticia.mimeType) {
        this.imagenPreview = `data:${noticia.mimeType};base64,${noticia.imagen.file}`;
      } else if (noticia.idImagen) {
        // Si hay idImagen pero no viene el base64, intentar construir URL del recurso
        this.imagenPreview = `${apis.Administrador}/noticias/imagen/${noticia.idImagen}`;
      }
      
      // Precargar targetNewTab basado en el valor de target
      this.targetNewTab = noticia.target === '_blank';
      
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
      
      // Convertir targetNewTab a valor de target
      this.formulario.target = this.targetNewTab ? '_blank' : '_self';
      
      // Asegurar que orden sea número
      if (this.formulario.orden !== null && this.formulario.orden !== undefined) {
        this.formulario.orden = Number(this.formulario.orden);
      }
      
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
    this.formulario.idPagina = this.id;

    if (!this.formulario.titulo || this.formulario.titulo.toString().trim() === '') {
      console.log('Campo requerido vacío: titulo');
      return false;
    }

    return true;
  }

  onImageSelected(event: any): void {
    const file: File | null = event?.target?.files?.[0] ?? null;
    if (!file) {
      return;
    }

    this.fileToUpload = file;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string | ArrayBuffer | null;
      if (typeof result === 'string') {
        this.imagenPreview = result;
        const base64 = result.split(',')[1] ?? null;
        this.formulario.imagen = {
          fileName: file.name,
          fileExtension: (file.name.split('.').pop() ?? null),
          file: base64
        };
        this.formulario.mimeType = file.type || null;
      }
    };
    reader.readAsDataURL(file);
  }

  validarEnlace(): void {
    const url = this.formulario.enlace?.trim();
    this.enlaceError = '';
    
    if (!url) return;

    // Validar formato de URL
    const urlPattern = /^(https?:\/\/)[^\s/$.?#].[^\s]*$/i;
    if (!urlPattern.test(url)) {
      this.enlaceError = 'El formato de la URL no es válido. Debe comenzar con http:// o https://';
      return;
    }

    this.validandoEnlace = true;
    
    // Intentar validar existencia usando fetch con mode no-cors (limitado pero funciona para detectar algunos errores)
    fetch(url, { method: 'HEAD', mode: 'no-cors' })
      .then(() => {
        this.enlaceError = '';
        this.validandoEnlace = false;
      })
      .catch(() => {
        this.enlaceError = 'No se pudo verificar el enlace. Asegúrese de que la URL sea correcta y accesible.';
        this.validandoEnlace = false;
      });
  }

  validarUrlRecurso(): void {
    const url = this.formulario.urlRecurso?.trim();
    this.urlRecursoError = '';
    
    if (!url) return;

    // Validar formato de URL
    const urlPattern = /^(https?:\/\/)[^\s/$.?#].[^\s]*$/i;
    if (!urlPattern.test(url)) {
      this.urlRecursoError = 'El formato de la URL no es válido. Debe comenzar con http:// o https://';
      return;
    }

    // Validar que sea una URL de video válida (YouTube, Vimeo, etc.)
    const videoPatterns = [
      /youtube\.com\/watch\?v=/i,
      /youtu\.be\//i,
      /vimeo\.com\//i,
      /dailymotion\.com\//i,
      /\.mp4$/i,
      /\.webm$/i
    ];
    
    const esVideoValido = videoPatterns.some(pattern => pattern.test(url));
    if (!esVideoValido) {
      this.urlRecursoError = 'La URL no parece ser un enlace de video válido (YouTube, Vimeo, etc.)';
      return;
    }

    this.validandoUrlRecurso = true;
    
    fetch(url, { method: 'HEAD', mode: 'no-cors' })
      .then(() => {
        this.urlRecursoError = '';
        this.validandoUrlRecurso = false;
      })
      .catch(() => {
        this.urlRecursoError = 'No se pudo verificar el enlace de video. Asegúrese de que la URL sea correcta.';
        this.validandoUrlRecurso = false;
      });
  }

  getImagenUrl(idImagen: number): string {
    return `${environment.urlMSAdministracion}Archivos/GetImg/${idImagen}`;
  }

  cambiarOrden(id: number, tipo: string): void {
    this.ms.putUpDown('noticias', `${id}/${tipo}`, apis.Administrador).then((response) => {
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
