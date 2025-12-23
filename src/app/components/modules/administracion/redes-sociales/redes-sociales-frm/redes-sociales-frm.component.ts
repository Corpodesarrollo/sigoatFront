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
import { Menus } from '../../../../../models/menus.model';
import { MsgTipo } from '../../../../../models/msgTipo.model';
import { Parametricas } from '../../../../../models/parametricas.model';
import { FileUploadModule } from 'primeng/fileupload';
import { MenuService } from '../../../../../services/menu.service';
import { ModulosService } from '../../../../../services/modulos.service';
import { TablerosService } from '../../../../../services/tableros.service';
import { MsgBoxComponent } from '../../../../shared/msg-box/msg-box.component';
import { Attachment } from '../../../../../models/attachment.model';
import { redesSociales } from '../../../../../models/redesSociales';
import { RedesSociales } from '../../../../../models/redes-sociales.model';

@Component({
  selector: 'app-redes-sociales-frm',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, InputTextModule, ButtonModule, DropdownModule, InputSwitchModule, DialogModule, MsgBoxComponent, FileUploadModule],
  templateUrl: './redes-sociales-frm.component.html',
  styleUrl: './redes-sociales-frm.component.css'
})
export class RedesSocialesFrmComponent {
  @Input() red?: RedesSociales;
  
  formulario: RedesSociales = {
    id: 0,
    idTipoRedSocial: 0,
    tipoRedSocial: '',
    url: '',
    idImagen: 0,
    imagen: undefined, // Assuming Attachment is defined elsewhere
  };

  tiposRedesSociales: Parametricas[] = redesSociales;
  selectedRedSocial: Parametricas | undefined;
  mensajeError: string = '';
  nombre: string = '';
  archivoSeleccionado: Attachment | null = null;
  submitted: boolean = false;
  saving: boolean = false;
  visible: boolean = false;
  msg: string = '';
  error: boolean = false;
  MsgTipo = MsgTipo;

  constructor(private fb: FormBuilder, private ms: MenuService, private mls: ModulosService, private ts: TablerosService, private router: Router) {}

  ngOnChanges() {
    if (this.red) {
      this.formulario = { ...this.red };
      this.selectedRedSocial = this.tiposRedesSociales.find(trs => trs.id === this.red?.idTipoRedSocial);
    } else {
      this.formulario = {
        id: 0,
        idTipoRedSocial: 0,
        tipoRedSocial: '',
        url: '',
        idImagen: 0,
        imagen: undefined, // Assuming Attachment is defined elsewhere
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
        result = await this.ms.post<RedesSociales>('redesSociales', this.formulario, apis.Administrador);
      } else {
        result = await this.ms.put<RedesSociales>('redesSociales', this.formulario, apis.Administrador);
      }

      if (!result?.error) {
        this.msg = 'La red se ha guardado correctamente.';
      } else {
        this.msg = 'Error al guardar la red. Por favor, inténtelo de nuevo.';
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
    let camposAValidar: (string | number | null | undefined)[] = [];
    this.formulario.idTipoRedSocial = this.selectedRedSocial?.id ?? 0;
    this.formulario.imagen = this.archivoSeleccionado;

    camposAValidar = [
      this.formulario.idTipoRedSocial,
      this.formulario.url
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
  
  onHide(event: any): void {
    this.visible = true;
    this.router.navigate([`/redesSociales`]);
  }
}
