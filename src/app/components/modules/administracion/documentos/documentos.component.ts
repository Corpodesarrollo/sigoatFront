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
import { apis } from '../../../../models/apis.model';
import { Attachment } from '../../../../models/attachment.model';
import { MsgBotones } from '../../../../models/msgBotones.model';
import { MsgTipo } from '../../../../models/msgTipo.model';
import { Paginas } from '../../../../models/paginas.model';
import { ResponseModel } from '../../../../models/response.model';
import { PaginasService } from '../../../../services/paginas.services';
import { MsgBoxComponent } from '../../../shared/msg-box/msg-box.component';
import { Anexos } from '../../../../models/anexos.model';
import { AnexosService } from '../../../../services/anexoss.services';
import { StepsComponent } from "../../../shared/steps/steps.component";
import { environment } from '../../../../../environments/environment';
import { permiso } from '../../../../models/permiso';
import { AuthServices } from '../../../../services/auth.service';
import { ViewerComponent } from "../../../shared/viewer/viewer.component";

@Component({
  selector: 'app-documentos',
  standalone: true,
  imports: [TableModule, ButtonModule, TooltipModule, CommonModule, ConfirmDialogModule, ToastModule,
    InputSwitchModule, FormsModule, MsgBoxComponent, DialogModule, FileUploadModule, InputTextModule, StepsComponent, ViewerComponent],
  providers: [ConfirmationService, MessageService],
  templateUrl: './documentos.component.html',
  styleUrl: './documentos.component.css'
})
export class DocumentosComponent {
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;
    pages: Anexos[] = [];
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
    
    formulario: Anexos = {
      id: 0,
      codigo: '',
      nombre: '',
      idPagina: 0,
      idArchivo: 0,
      archivo: null,
      mimeType: ''
    };

    mensajeError: string = '';
    nombre: string = '';
    archivoSeleccionado: Attachment | null = null;
    displayViewer: boolean = false;
    permisoCrear!: Promise<boolean>;
    permisoEditar!: Promise<boolean>;
    permisoEliminar!: Promise<boolean>;
    modulo: string = 'Documentos';
      
    constructor(private auth: AuthServices, private messageService: MessageService, private ms: AnexosService, private ps: PaginasService, private route: ActivatedRoute, private router: Router) {
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
  
        let anexo = await this.ms.getAllById("anexos", this.id, apis.Administrador);
        console.log(anexo);
        if (anexo) {
          let result: ResponseModel = anexo;
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
        codigo: '',
        nombre: '',
        idPagina: 0,
        idArchivo: 0,
        archivo: null,
        mimeType: ''
      };
      this.archivoSeleccionado = null;
      this.mensajeError = '';
      this.nombre = '';
      this.submitted = false;
      this.saving = false;
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

    download(id: number): void {
      window.open(`${environment.urlMSAdministracion}Anexos/GetDoc/${id}`, '_blank');
    }
  
    onHide(event: any): void {
      console.log('Dialog closed', event);
      this.visible = false;
      if (event == true) {
        this.ms.delete('anexos', this.idEliminar, apis.Administrador).then((response) => {
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

      //Recuerda que los documentos que debes subir aquí deben de ser formato PDF, XLSX y DOCX que no supere 20MB.
  
      if (!archivo) return;
  
      const tiposPermitidos = ['application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      const tamanoMaximo = 20 * 1024 * 1024; // 4MB
  
      // Validar tipo
      if (!tiposPermitidos.includes(archivo.type)) {
        this.mensajeError = 'El archivo debe ser PDF, XLSX y DOCX.';
        return;
      }
  
      // Validar tamaño
      if (archivo.size > tamanoMaximo) {
        this.mensajeError = 'El tamaño máximo permitido es 20MB.';
        return;
      }
  
      if (archivo) {
  
        const lector = new FileReader();
  
        lector.onload = () => {
          const base64 = (lector.result as string).split(',')[1]; // eliminar el encabezado "data:*/*;base64,"
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
  
    cambiarOrden(id:number, tipo: string): void {
      let response = this.ms.putUpDown('anexos', `${id}/${tipo}`, apis.Administrador).then((response) => {
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
  
    continuar(): void {
      this.router.navigate([`/noticias/${this.id}`]);
    }
  
    anterior(): void {
      this.router.navigate([`/carrusel/${this.id}`]);
    }

    async onSubmit() {
      this.submitted = true;
      if (this.validarCamposRequeridos() && !this.saving) {
        this.saving = true;
        let response = await this.ms.post<Anexos>('anexos', this.formulario, apis.Administrador);
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
      let camposAValidar: (string | null | Attachment | undefined)[] = [];
      this.formulario.archivo = this.archivoSeleccionado
      this.formulario.idPagina = this.id;
      this.formulario.mimeType = this.archivoSeleccionado?.fileExtension || '';
  
      camposAValidar = [
        this.formulario.codigo,
        this.formulario.nombre,
        this.formulario.archivo,
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
