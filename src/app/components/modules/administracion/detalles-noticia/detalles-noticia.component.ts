import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { environment } from '../../../../../environments/environment';
import { apis } from '../../../../models/apis.model';
import { Attachment } from '../../../../models/attachment.model';
import { MsgBotones } from '../../../../models/msgBotones.model';
import { MsgTipo } from '../../../../models/msgTipo.model';
import { ResponseModel } from '../../../../models/response.model';
import { MsgBoxComponent } from '../../../shared/msg-box/msg-box.component';
import { StepsComponent } from '../../../shared/steps/steps.component';
import { DetallesNoticias } from '../../../../models/detallesNoticias.model';
import { Noticias } from '../../../../models/noticias.model';
import { NoticiasServices } from '../../../../services/noticias.services';
import { DetalleNoticiasServices } from '../../../../services/detalleNoticias.services';
import { TipoNoticia } from '../../../../models/tipoNoticia.model';
import { DropdownModule } from 'primeng/dropdown';
import { Parametricas } from '../../../../models/parametricas.model';
import { EditorModule } from 'primeng/editor';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-detalles-noticia',
  standalone: true,
  imports: [TableModule, ButtonModule, TooltipModule, CommonModule, ConfirmDialogModule, ToastModule, DropdownModule, EditorModule,
      InputSwitchModule, FormsModule, MsgBoxComponent, DialogModule, FileUploadModule, InputTextModule, StepsComponent],
  providers: [ConfirmationService, MessageService],
  templateUrl: './detalles-noticia.component.html',
  styleUrl: './detalles-noticia.component.css'
})
export class DetallesNoticiaComponent {
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;
  pages: DetallesNoticias[] = [];
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

  displayModal: boolean = false;
  imageUrl = '';
  fileToUpload: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  id: number | undefined;
  TipoNoticia = TipoNoticia;
  
  formulario: DetallesNoticias = {
    id: 0,
    idNoticia: 0,
    tipo: null,
    contenido: null,
    url: null,
    idArchivo: null,
    archivo: null,
    mimeType: null,
    orden: null
  }

  tipos: Parametricas[] = [
    { id: 0, nombre: 'Título' },
    { id: 1, nombre: 'Texto enriquecido' },
    { id: 2, nombre: 'Imagen' },
    { id: 3, nombre: 'Imagen Url' },
    { id: 5, nombre: 'Video' },
    { id: 6, nombre: 'Audio' }
  ];
  
  seletedTipo: Parametricas | null = null;
  imagenPreview: string | null = null;
  urlImagen: string = '';
  mensajeError: string = '';
  nombre: string = '';
  archivoSeleccionado: Attachment | null = null;
    
  constructor(private messageService: MessageService, private ms: DetalleNoticiasServices, private ps: NoticiasServices, private route: ActivatedRoute, private router: Router, private sanitizer: DomSanitizer) {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      this.id = idParam ? +idParam : undefined;
    });
  }

  async ngOnInit() {
    if (this.id !== undefined) {
      this.loading = true;
      let pagina = await this.ps.getById<Noticias>("noticias", this.id, apis.Administrador);
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

      let detalle = await this.ms.getAllById("noticiasDetalles", this.id, apis.Administrador);
      if (detalle) {
        let result: ResponseModel = detalle;
        if (result.error) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: result.dataError.message });
          return;
        }
        
        console.log('Detalles de la noticia:', result.data);
        this.pages = result.data;
        this.totalRecords = result.data.length;
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar el carrusel.' });
      }
    }
    this.loading = false;
  }

  agregar() {
    this.displayModal = true;
    console.log('Abrir modal para agregar nueva página');
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
      this.ms.delete('noticiasDetalles', this.idEliminar, apis.Administrador).then((response) => {
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
        response = await this.ms.post<Noticias>('noticiasDetalles', this.formulario, apis.Administrador);
      } else {
        response = await this.ms.put<Noticias>('noticiasDetalles', this.formulario, apis.Administrador);
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

  validarCamposRequeridos(): boolean {
    let camposAValidar: (string | TipoNoticia | Attachment | null | undefined)[] = [];
    this.formulario.idNoticia = this.id ?? null;
    this.formulario.archivo = this.archivoSeleccionado ?? null;
    this.formulario.mimeType = this.archivoSeleccionado?.fileExtension ?? null;

    if (this.formulario.tipo === TipoNoticia.Titulo || this.formulario.tipo === TipoNoticia.Texto) {
      camposAValidar = [
        this.formulario.tipo,
        this.formulario.contenido,
      ];
    } else if (this.formulario.tipo === TipoNoticia.Imagen || this.formulario.tipo === TipoNoticia.Anexo) {
      camposAValidar = [
        this.formulario.tipo,
        this.formulario.archivo,
      ];
    } else if (this.formulario.tipo === TipoNoticia.Video || this.formulario.tipo === TipoNoticia.Audio || this.formulario.tipo === TipoNoticia.ImagenUrl) {
      camposAValidar = [
        this.formulario.tipo,
        this.formulario.url,
      ];
    }

    console.log('Campos a validar:', camposAValidar);
    
    let pos = 0;
    for (const campo of camposAValidar) {
      pos++;
      if (campo == null || campo.toString().trim() === '') {
        console.log('Posición:', pos);
        return false;
      }
    }

    return true;
  }
  
  async onArchivoSeleccionado(event: any): Promise<void> {
    this.nombre = '';
    this.mensajeError = '';

    const archivo: File = event.files?.[0]; // 🔁 Cambio aquí

    if (!archivo) return;

    const tiposPermitidos = ['image/jpeg', 'image/jpg', 'image/png'];
    const tamanoMaximo = 4 * 1024 * 1024; // 4MB

    // Validar tipo
    if (!tiposPermitidos.includes(archivo.type)) {
      this.mensajeError = 'El archivo debe ser JPG, JPEG o PNG.';
      return;
    }

    // Validar tamaño
    if (archivo.size > tamanoMaximo) {
      this.mensajeError = 'El tamaño máximo permitido es 4MB.';
      return;
    }

    const lector = new FileReader();

    lector.onload = () => {
      const base64 = (lector.result as string).split(',')[1]; // quitar encabezado
      this.imagenPreview = lector.result as string;
      this.nombre = archivo.name;
      this.archivoSeleccionado = {
        fileName: archivo.name,
        fileExtension: archivo.type,
        file: base64
      };
      console.log('Archivo seleccionado:', this.archivoSeleccionado);
    };

    lector.readAsDataURL(archivo);
  }
  
  async subirArchivo(): Promise<void> {
    console.log('Subir archivo:', this.archivoSeleccionado);
    this.formulario.id = 0;
    this.formulario.idNoticia = this.id || 0; // Asegurarse de que idNoicia tenga un valor válido

    if (this.archivoSeleccionado){
      this.formulario.archivo = this.archivoSeleccionado;
      this.formulario.mimeType = this.archivoSeleccionado.fileExtension;
    }

    let response = await this.ms.post('noticiasDetalles', this.formulario, apis.Administrador);
    if (response) {
      let result: ResponseModel = response;
      if (result.error) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: result.dataError.message });
      } else {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Archivo subido correctamente' });
        this.displayModal = false;
        this.ngOnInit(); 
      }
    }
  }
  
  cambiarOrden(id:number, tipo: string): void {
    let response = this.ms.putUpDown('noticiasDetalles', `${id}/${tipo}`, apis.Administrador).then((response) => {
      console.log('Respuesta de cambiar orden:', response);
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

  cargarUrl(id: number): string {
    console.log('Cargar URL para ID:', id);
    return `${environment.urlMSAdministracion}noticiasDetalles/GetImg/${id}`;
  }

  async validarImagen(url: string): Promise<void> {
    try {
      const res = await fetch(url, { method: 'GET' });

      const tipo = res.headers.get('Content-Type');
      const esImagen = res.ok && tipo?.startsWith('image');

      if (esImagen) {
        this.mensajeError = '';
        this.formulario.url = url;
        this.imagenPreview = url;
      } else {
        this.mensajeError = 'La URL no es una imagen válida.';
        this.urlImagen = '';
        this.imagenPreview = null;
      }
    } catch {
      this.mensajeError = 'No se pudo validar la imagen.';
      this.urlImagen = '';
      this.imagenPreview = null;
    }
  }

  sanitizarURL(url: string): SafeResourceUrl {
    // Reemplaza el link de YouTube normal por el formato embebido
    const embedUrl = url.replace('watch?v=', 'embed/');
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }

  continuar(): void {
    this.router.navigate([`/documentos/${this.id}`]);
  }

  anterior(): void {
    this.router.navigate([`/noticias/${this.id}`]);
  }
}
