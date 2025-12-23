import { Component } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { apis } from '../../../../models/apis.model';
import { MsgTipo } from '../../../../models/msgTipo.model';
import { Contactenos } from '../../../../models/contactenos.model';
import { ContactenosService } from '../../../../services/contactenos.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { MsgBoxComponent } from '../../../shared/msg-box/msg-box.component';
import { MsgBotones } from '../../../../models/msgBotones.model';

@Component({
  selector: 'app-contactenos',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, InputTextModule, ButtonModule, DropdownModule, InputSwitchModule, DialogModule, MsgBoxComponent],
  template: '', // No template loaded
  styleUrl: './contactenos.component.css'
})
export class ContactenosComponent {
  formulario: Contactenos = {
    id: 0,
    email: '',
    telefono: '',
    asunto: '',
    mensaje: '',
  };

  submitted: boolean = false;
  saving: boolean = false;
  visible: boolean = false;
  msg: string = '';
  error: boolean = false;
  MsgTipo = MsgTipo;
  MsgBotones = MsgBotones;

  constructor(private fb: FormBuilder, private ms: ContactenosService, private router: Router) {}

  ngOnInit(): void {
    window.open('https://www.minsalud.gov.co/atencion/Paginas/Atencion_al_Ciudadano.aspx', '_blank');
    setTimeout(() => {
      this.router.navigate(['/portal']);
    }, 300); // 0.3s de delay
  }

  async onSubmit() {
    this.submitted = true;
    if (this.validarCamposRequeridos() && !this.saving) {
      this.saving = true;
      let result;
      if (this.formulario.id === 0) {
        result = await this.ms.post<Contactenos>('Contactenos', this.formulario, apis.Administrador);
      } else {
        result = await this.ms.put<Contactenos>('Contactenos', this.formulario, apis.Administrador);
      }

      if (!result?.error) {
        this.msg = 'Su mensaje se ha enviado correctamente.';
      } else {
        this.msg = 'Error al enviar el mensaje. Por favor, inténtelo de nuevo más tarde.';
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
    let camposAValidar: (string | number | undefined | null)[] = [];

    camposAValidar = [
      this.formulario.email,
      this.formulario.telefono,
      this.formulario.asunto,
      this.formulario.mensaje,
    ];
    
    let pos = 0;
    for (const campo of camposAValidar) {
      pos++;
      if (!campo || campo.toString().trim() === '' || campo.toString() === '0') {
        return false;
      }
    }

    return true;
  }

  cancelar(): void {
    this.router.navigate([`/contactenos`]);
  }

  onHide(event: any): void {
    this.visible = true;
    this.router.navigate([`/contactenos`]);
  }
}
