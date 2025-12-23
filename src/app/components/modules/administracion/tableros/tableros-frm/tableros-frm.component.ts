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
import { Tableros } from '../../../../../models/tableros.model';

@Component({
  selector: 'app-tableros-frm',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, InputTextModule, ButtonModule, DropdownModule, InputSwitchModule, DialogModule, MsgBoxComponent],
  templateUrl: './tableros-frm.component.html',
  styleUrl: './tableros-frm.component.css'
})
export class TablerosFrmComponent {
  @Input() tablero?: Tableros;
  
    formulario: Tableros = {
      id: 0,
      titulo: '',
      url: '',
      estado: true,
    };

    submitted: boolean = false;
    saving: boolean = false;
    visible: boolean = false;
    msg: string = '';
    error: boolean = false;
    MsgTipo = MsgTipo;
  
    constructor(private fb: FormBuilder, private ms: MenuService, private mls: ModulosService, private router: Router) {}
  
    ngOnChanges() {
      if (this.tablero) {
        this.formulario = { ...this.tablero };
      } else {
        this.formulario = {
          id: 0,
          titulo: '',
          url: '',
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
          result = await this.ms.post<Tableros>('tableros', this.formulario, apis.Administrador);
        } else {
          result = await this.ms.put<Tableros>('tableros', this.formulario, apis.Administrador);
        }
  
        if (!result?.error) {
          this.msg = 'El tablero se ha guardado correctamente.';
        } else {
          this.msg = 'Error al guardar el tablero. Por favor, inténtelo de nuevo.';
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
      let camposAValidar: (string | null | undefined)[] = [];
  
      camposAValidar = [
        this.formulario.titulo,
        this.formulario.url,
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
      this.router.navigate([`/tableros`]);
    }
  
    onHide(event: any): void {
      this.visible = true;
      this.router.navigate([`/tableros`]);
    }

}
