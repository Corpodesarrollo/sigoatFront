import { Component, Input } from '@angular/core';
import { Roles } from '../../../../../models/roles.model';
import { Router } from '@angular/router';
import { apis } from '../../../../../models/apis.model';
import { MsgTipo } from '../../../../../models/msgTipo.model';
import { RolesService } from '../../../../../services/roles.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { MsgBoxComponent } from '../../../../shared/msg-box/msg-box.component';

@Component({
  selector: 'app-roles-frm',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, InputTextModule, ButtonModule, DropdownModule, InputSwitchModule, DialogModule, MsgBoxComponent],
  templateUrl: './roles-frm.component.html',
  styleUrl: './roles-frm.component.css'
})
export class RolesFrmComponent {
  @Input() rol?: Roles;
  
    formulario: Roles = {
      id: 0,
      nombre: '',
      descripcion: '',
      codigo: '',
      estado: true,
    };

    submitted: boolean = false;
    saving: boolean = false;
    visible: boolean = false;
    msg: string = '';
    error: boolean = false;
    MsgTipo = MsgTipo;
  
    constructor(private ms: RolesService, private router: Router) {}
  
    ngOnChanges() {
      if (this.rol) {
        this.formulario = { ...this.rol };
      } else {
        this.formulario = {
          id: 0,
          nombre: '',
          descripcion: '',
          codigo: '',
          estado: true,
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
          result = await this.ms.post<Roles>('roles', this.formulario, apis.Seguridad);
        } else {
          result = await this.ms.put<Roles>('roles', this.formulario, apis.Seguridad);
        }
  
        if (!result?.error) {
          this.msg = 'El rol se ha guardado correctamente.';
        } else {
          this.msg = 'Error al guardar el rol. Por favor, inténtelo de nuevo.';
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
        this.formulario.codigo,
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
      this.router.navigate([`/roles`]);
    }
  
    onHide(event: any): void {
      this.visible = true;
      this.router.navigate([`/roles`]);
    }
}
