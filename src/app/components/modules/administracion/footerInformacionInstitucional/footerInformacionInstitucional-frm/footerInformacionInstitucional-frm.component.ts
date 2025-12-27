import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { FileUploadModule } from 'primeng/fileupload';
import { apis } from '../../../../../models/apis.model';
import { MsgTipo } from '../../../../../models/msgTipo.model';
import { MsgBoxComponent } from '../../../../shared/msg-box/msg-box.component';
import { FooterInformacionInstitucional } from '../../../../../models/footerInformacionInstitucional.model';
import { FooterInformacionInstitucionalService } from '../../../../../services/footerInformacionInstitucional.service';
import { Attachment } from '../../../../../models/attachment.model';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-footerInformacionInstitucional-frm',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, InputTextModule, ButtonModule, DropdownModule, InputSwitchModule, DialogModule, MsgBoxComponent, FileUploadModule],
  templateUrl: './footerInformacionInstitucional-frm.component.html',
  styleUrl: './footerInformacionInstitucional-frm.component.css'
})
export class FooterInformacionInstitucionalFrmComponent  {
  @Input() footerInformacionInstitucional?: FooterInformacionInstitucional;
  
  formulario: FooterInformacionInstitucional = {
    id: 0,
    direccion: '',
    telefonos: '',
    horarios: '',
    correos: '',
    enlaceTwitter: '',
    enlaceFacebook: '',
    enlaceInstagram: '',
    enlaceYouTube: '',
    enlaceContactenos: '',
    idLogoOficial: null,
    logoOficial: null,
    mimeType: null,
    colorPrimario: '#000000',
    colorSecundario: '#ffffff',
    tipografia: '',
    colorFuentePrimaria: '#000000',
    colorFuenteSecundaria: '#ffffff'
  };
  
  archivoSeleccionadoLogo: Attachment | null = null;
  submitted: boolean = false;
  saving: boolean = false;
  visible: boolean = false;
  msg: string = '';
  error: boolean = false;
  MsgTipo = MsgTipo;

  constructor(private fb: FormBuilder, private ms: FooterInformacionInstitucionalService, private router: Router) {}

  ngOnChanges() {
    if (this.footerInformacionInstitucional) {
      this.formulario = { ...this.footerInformacionInstitucional };
    } else {
      this.formulario = {
        id: 0,
        direccion: '',
        telefonos: '',
        horarios: '',
        correos: '',
        enlaceTwitter: '',
        enlaceFacebook: '',
        enlaceInstagram: '',
        enlaceYouTube: '',
        enlaceContactenos: '',
        idLogoOficial: null,
        logoOficial: null,
        mimeType: null,
        colorPrimario: '#000000',
        colorSecundario: '#ffffff',
        tipografia: '',
        colorFuentePrimaria: '#000000',
        colorFuenteSecundaria: '#ffffff'
      };
    }
  }
  
    async ngOnInit(): Promise<void> {
    }
  
    async onSubmit() {
    this.submitted = true;
    if (this.validarCamposRequeridos() && !this.saving) {
      this.saving = true;
      
      if (this.archivoSeleccionadoLogo) {
        this.formulario.logoOficial = this.archivoSeleccionadoLogo;
      }
      
      let response;
      if (this.formulario.id === 0) {
        response = await this.ms.post<FooterInformacionInstitucional>('footerInformacionInstitucional', this.formulario, apis.Administrador);
      } else {
        response = await this.ms.put<FooterInformacionInstitucional>('footerInformacionInstitucional', this.formulario, apis.Administrador);
      }

      if (response) {
        if (!response.error) {
          this.msg = 'La información institucional se ha guardado correctamente.';
        } else {
          this.msg = 'Error al guardar la información institucional. Por favor, inténtelo de nuevo.';
          if (response) {
            console.log(response.dataError);
          }
        }
  
        this.error = !!response?.error;
        this.visible = true;
      }
    }
    else {
      this.msg = 'Por favor, complete todos los campos requeridos.';
      console.log('Error en la validación de los campos');
    }
    this.saving = false;
  }

  validarCamposRequeridos(): boolean {
    return true;
  }

  async onArchivoSeleccionado(event: any): Promise<void> {
    const archivo: File = event.files?.[0];

    if (!archivo) return;

    const tiposPermitidos = ['image/jpeg', 'image/jpg', 'image/png'];
    const tamanoMaximo = 4 * 1024 * 1024; // 4MB

    if (!tiposPermitidos.includes(archivo.type)) {
      console.log('Tipo de archivo no permitido:', archivo.type);
      return;
    }

    if (archivo.size > tamanoMaximo) {
      console.log('El tamaño máximo permitido es 4MB.');
      return;
    }

    const lector = new FileReader();

    lector.onload = () => {
      const base64 = (lector.result as string).split(',')[1];
      this.archivoSeleccionadoLogo = {
        fileName: archivo.name,
        fileExtension: archivo.type,
        file: base64
      };
      this.formulario.mimeType = archivo.type || null;
    };

    lector.readAsDataURL(archivo);
  }

  cargarUrl(id: number | null): string {
    return `${environment.urlMSAdministracion}footerInformacionInstitucional/GetImg/${id}`;
  }

  onHide(event: any): void {
    this.visible = false;
  }
}
