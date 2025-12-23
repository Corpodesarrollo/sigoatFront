import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { apis } from '../../../../../models/apis.model';
import { MsgTipo } from '../../../../../models/msgTipo.model';
import { FileUploadModule } from 'primeng/fileupload';
import { MenuService } from '../../../../../services/menu.service';
import { ModulosService } from '../../../../../services/modulos.service';
import { TablerosService } from '../../../../../services/tableros.service';
import { MsgBoxComponent } from '../../../../shared/msg-box/msg-box.component';
import { Attachment } from '../../../../../models/attachment.model';
import { Configuracion } from '../../../../../models/configuracion.model';
import { ColorPickerModule } from 'primeng/colorpicker';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-configuracion-frm',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, InputTextModule, ButtonModule, DropdownModule,
  InputSwitchModule, DialogModule, MsgBoxComponent, FileUploadModule, ColorPickerModule],
  templateUrl: './configuracion-frm.component.html',
  styleUrl: './configuracion-frm.component.css'
})
export class ConfiguracionFrmComponent {
  @Input() config?: Configuracion;
 
  formulario: Configuracion = {
    id: 0,
    colorGovCo: null,
    colorPrincipal: null,
    idLogoIzquierdo: null,
    logoIzquierdo: null,
    idLogoDerecho: null,
    logoDerecho: null,
    redesSociales: false
  };
  
  archivoSeleccionadoLogoIzquierdo: Attachment | null = null;
  archivoSeleccionadoLogoDerecho: Attachment | null = null;
  submitted: boolean = false;
  saving: boolean = false;
  visible: boolean = false;
  msg: string = '';
  error: boolean = false;
  MsgTipo = MsgTipo;

  constructor(private fb: FormBuilder, private ms: MenuService, private mls: ModulosService, private ts: TablerosService, private router: Router) {}

  ngOnChanges() {
    console.log('ngOnChanges - Configuración:', this.config);
    if (this.config) {
      this.formulario = { ...this.config };
    } else {
      this.formulario = {
        id: 0,
        colorGovCo: null,
        colorPrincipal: null,
        idLogoIzquierdo: null,
        logoIzquierdo: null,
        idLogoDerecho: null,
        logoDerecho: null,
        redesSociales: false
      };
    }
  }

  async ngOnInit(): Promise<void> {
  }

  async onSubmit() {
    this.submitted = true;
    if (this.validarCamposRequeridos() && !this.saving) {
      this.saving = true;
      let result;
      if (this.formulario.id === 0) {
        result = await this.ms.post<Configuracion>('Configuracion', this.formulario, apis.Administrador);
      } else {
        result = await this.ms.put<Configuracion>('Configuracion', this.formulario, apis.Administrador);
      }

      if (!result?.error) {
        this.msg = 'La Configuración se ha guardado correctamente.';
      } else {
        this.msg = 'Error al guardar la Configuración. Por favor, inténtelo de nuevo.';
        console.log(result.dataError);
      }

      this.error = !!result?.error;
      this.visible = true;
    }
    else {
      this.msg = 'Por favor, complete todos los campos requeridos.';
      console.log('Error en la validación de los campos');
    }
    this.saving = false;
  }

  validarCamposRequeridos(): boolean {
    let camposAValidar: (null | Attachment)[] = [];

    if(this.archivoSeleccionadoLogoIzquierdo){
      this.formulario.logoIzquierdo = this.archivoSeleccionadoLogoIzquierdo;
    }

    if(this.archivoSeleccionadoLogoDerecho){
      this.formulario.logoDerecho = this.archivoSeleccionadoLogoDerecho;
    }

    camposAValidar = [
      this.archivoSeleccionadoLogoIzquierdo ?? this.formulario.logoIzquierdo,
      this.archivoSeleccionadoLogoDerecho ?? this.formulario.logoDerecho
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

  cancelar(): void {
    this.router.navigate([`/redesSociales`]);
  }

  async onArchivoSeleccionado(event: any, tipo: number): Promise<void> {

    const archivo: File = event.files?.[0]; // 🔁 Cambio aquí

    if (!archivo) return;

    const tiposPermitidos = ['image/jpeg', 'image/jpg', 'image/png'];
    const tamanoMaximo = 4 * 1024 * 1024; // 4MB

    // Validar tipo
    if (!tiposPermitidos.includes(archivo.type)) {
      console.log('Tipo de archivo no permitido:', archivo.type);
      return;
    }

    // Validar tamaño
    if (archivo.size > tamanoMaximo) {
      console.log('El tamaño máximo permitido es 4MB.');
      return;
    }

    const lector = new FileReader();

    lector.onload = () => {
      const base64 = (lector.result as string).split(',')[1];
      switch (tipo) {
        case 1:
          this.archivoSeleccionadoLogoIzquierdo = {
            fileName: archivo.name,
            fileExtension: archivo.type,
            file: base64
          };
          break;
        case 2:
          this.archivoSeleccionadoLogoDerecho = {
            fileName: archivo.name,
            fileExtension: archivo.type,
            file: base64
          };
          break;
        default:
          break;
      }
    };

    lector.readAsDataURL(archivo);
  }
  
  onHide(event: any): void {
    this.visible = true;
  }

  cargarUrl(id: string | null): string {
    return `${environment.urlMSAdministracion}Configuracion/GetImg/${id}`;
  }
}
