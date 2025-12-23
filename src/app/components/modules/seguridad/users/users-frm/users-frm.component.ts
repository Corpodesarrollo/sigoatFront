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
import { Users } from '../../../../../models/users.model';
import { UsersService } from '../../../../../services/user.service';
import { Parametricas } from '../../../../../models/parametricas.model';
import { ResponseModel } from '../../../../../models/response.model';

@Component({
  selector: 'app-users-frm',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, InputTextModule, ButtonModule, DropdownModule, InputSwitchModule, DialogModule, MsgBoxComponent],
  templateUrl: './users-frm.component.html',
  styleUrl: './users-frm.component.css'
})
export class UsersFrmComponent {
    @Input() user?: Users;

    roles: Parametricas[] = [];
    selectedRol: Parametricas | undefined;
    isLoadingRoles: boolean = true;
  
    formulario: Users = {
      id: 0,
      alias: '',
      email: '',
      name: '',
      rolId: 0,
      estado: true
    };

    submitted: boolean = false;
    saving: boolean = false;
    visible: boolean = false;
    msg: string = '';
    error: boolean = false;
    MsgTipo = MsgTipo;
  
    constructor(private ms: UsersService, private router: Router) {}
  
    ngOnChanges() {
      if (this.user) {
        this.formulario = { ...this.user };
      } else {
        this.formulario = {
          id: 0,
          alias: '',
          email: '',
          name: '',
          rolId: 0,
          estado: true
        };
      }
    }
  
    async ngOnInit(): Promise<void> {
      let response = await this.ms.getAll('roles', apis.Seguridad);
      if (response) {
        let result: ResponseModel = response;
        if (!result.error) {
          this.roles = result.data;
        }
      }
      
      this.isLoadingRoles = false;
    }
  
    async onSubmit() {
      this.submitted = true;
      if (this.validarCamposRequeridos() && !this.saving) {
        this.saving = true;
        let result;
        if (this.formulario.id === 0) {
          result = await this.ms.post<Users>('users', this.formulario, apis.Seguridad);
        } else {
          result = await this.ms.put<Users>('users', this.formulario, apis.Seguridad);
        }
  
        if (!result?.error) {
          this.msg = 'El usuario se ha guardado correctamente.';
        } else {
          this.msg = 'Error al guardar el usuario. Por favor, inténtelo de nuevo.';
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
      this.formulario.rolId = this.selectedRol?.id;
  
      camposAValidar = [
        this.formulario.alias,
        this.formulario.email,
        this.formulario.name,
        this.formulario.rolId
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
      this.router.navigate([`/usuarios`]);
    }
  
    onHide(event: any): void {
      this.visible = true;
      this.router.navigate([`/usuarios`]);
    }
}
