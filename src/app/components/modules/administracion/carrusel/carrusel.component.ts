import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TableModule, TableLazyLoadEvent } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { apis } from '../../../../models/apis.model';
import { MsgBotones } from '../../../../models/msgBotones.model';
import { MsgTipo } from '../../../../models/msgTipo.model';
import { ResponseModel } from '../../../../models/response.model';
import { MsgBoxComponent } from '../../../shared/msg-box/msg-box.component';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { Carrusel } from '../../../../models/carrusel.model';
import { InputTextModule } from 'primeng/inputtext';
import { CarruselService } from '../../../../services/carrusel.services';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { PaginasService } from '../../../../services/paginas.services';
import { Paginas } from '../../../../models/paginas.model';
import { Attachment } from '../../../../models/attachment.model';
import { StepsComponent } from "../../../shared/steps/steps.component";

@Component({
  selector: 'app-carrusel',
  standalone: true,
  imports: [TableModule, ButtonModule, TooltipModule, CommonModule, ConfirmDialogModule, ToastModule,
    InputSwitchModule, FormsModule, MsgBoxComponent, DialogModule, FileUploadModule, InputTextModule, StepsComponent],
  providers: [ConfirmationService, MessageService],
  templateUrl: './carrusel.component.html',
  styleUrl: './carrusel.component.css'
})
export class CarruselComponent {
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;
  pages: Carrusel[] = [];
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

  displayModal: boolean = false;
  imageUrl = '';
  fileToUpload: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  id: number | undefined;
  
  carrusel: Carrusel = {
    id: null,
    idPagina: null,
    idArchivo: null,
    archivo: null,
    mimeType: null,
    url: null,
    orden: null
  }
    
  imagenPreview: string | null = null;
  urlImagen: string = '';
  mensajeError: string = '';
  nombre: string = '';
  archivoSeleccionado: Attachment | null = null;
    
  constructor(private messageService: MessageService, private ms: CarruselService, private ps: PaginasService, private route: ActivatedRoute, private router: Router) {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      this.id = idParam ? +idParam : undefined;
    });
  }

  async ngOnInit() {
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

      let carrusel = await this.ms.getAllById("imagenes", this.id, apis.Administrador);
      if (carrusel) {
        let result: ResponseModel = carrusel;
        if (result.error) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: result.dataError.message });
          return;
        }
        
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
      this.ms.delete('imagenes', this.idEliminar, apis.Administrador).then((response) => {
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

  async onArchivoSeleccionado(event: any): Promise<void> {
    this.nombre = '';
    this.mensajeError = '';
    const archivo = event.target.files[0];

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

    if (archivo) {

      const lector = new FileReader();

      lector.onload = () => {
        const base64 = (lector.result as string).split(',')[1]; // eliminar el encabezado "data:*/*;base64,"
        this.imagenPreview = lector.result as string;
        this.nombre = archivo.name;
        this.archivoSeleccionado = {
          fileName: archivo.name,
          fileExtension: archivo.type,
          file: base64
        };
      };

      lector.readAsDataURL(archivo);
      console.log('Archivo seleccionado:', this.archivoSeleccionado);
    }
  }

  async subirArchivo(): Promise<void> {
    console.log('Subir archivo:', this.archivoSeleccionado);
    this.carrusel.id = 0;
    this.carrusel.idPagina = this.id;
    this.carrusel.url = this.urlImagen;

    if (this.archivoSeleccionado){
      this.carrusel.archivo = this.archivoSeleccionado;
      this.carrusel.mimeType = this.archivoSeleccionado.fileExtension;
    }
    

    let response = await this.ms.post('imagenes', this.carrusel, apis.Administrador);
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
    let response = this.ms.putUpDown('imagenes', `${id}/${tipo}`, apis.Administrador).then((response) => {
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
    return `${environment.urlMSAdministracion}Imagenes/GetImg/${id}`;
  }

  async validarImagen(url: string): Promise<void> {
    try {
      const res = await fetch(url, { method: 'GET' });

      const tipo = res.headers.get('Content-Type');
      const esImagen = res.ok && tipo?.startsWith('image');

      if (esImagen) {
        this.mensajeError = '';
        this.carrusel.url = url;
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

  continuar(): void {
    this.router.navigate([`/documentos/${this.id}`]);
  }

  anterior(): void {
    this.router.navigate([`/paginas`]);
  }
}
