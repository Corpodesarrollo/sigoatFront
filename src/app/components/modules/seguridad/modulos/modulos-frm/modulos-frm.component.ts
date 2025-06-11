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
import { MenuService } from '../../../../../services/menu.service';
import { ModulosService } from '../../../../../services/modulos.service';
import { MsgBoxComponent } from '../../../../shared/msg-box/msg-box.component';
import { Modulos } from '../../../../../models/modulos.model';

@Component({
  selector: 'app-modulos-frm',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, InputTextModule, ButtonModule, DropdownModule, InputSwitchModule, DialogModule, MsgBoxComponent],
  templateUrl: './modulos-frm.component.html',
  styleUrl: './modulos-frm.component.css'
})
export class ModulosFrmComponent {
  @Input() modulo?: Modulos;
  
    formulario: Modulos = {
      id: 0,
      nombre: '',
      path: '',
    };

    submitted: boolean = false;
    saving: boolean = false;
    visible: boolean = false;
    msg: string = '';
    error: boolean = false;
    MsgTipo = MsgTipo;
  
    constructor(private fb: FormBuilder, private ms: ModulosService, private router: Router) {}
  
    ngOnChanges() {
      if (this.modulo) {
        this.formulario = { ...this.modulo };
      } else {
        this.formulario = {
          id: 0,
          nombre: '',
          path: '',
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
          result = await this.ms.post<Modulos>('modulos', this.formulario, apis.Seguridad);
        } else {
          result = await this.ms.put<Modulos>('modulos', this.formulario, apis.Seguridad);
        }
  
        if (!result?.error) {
          this.msg = 'El módulo se ha guardado correctamente.';
        } else {
          this.msg = 'Error al guardar el módulo. Por favor, inténtelo de nuevo.';
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
      
      let camposAValidar: (string | number | undefined)[] = [];
  
      camposAValidar = [
        this.formulario.nombre,
        this.formulario.path
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
      this.router.navigate([`/modulos`]);
    }
  
    onHide(event: any): void {
      this.visible = true;
      this.router.navigate([`/modulos`]);
    }
}
