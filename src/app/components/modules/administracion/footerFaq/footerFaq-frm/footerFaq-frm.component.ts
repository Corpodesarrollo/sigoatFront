import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { EditorModule } from 'primeng/editor';
import { apis } from '../../../../../models/apis.model';
import { Menus } from '../../../../../models/menus.model';
import { MsgTipo } from '../../../../../models/msgTipo.model';
import { Parametricas } from '../../../../../models/parametricas.model';
import { MenuService } from '../../../../../services/menu.service';
import { ModulosService } from '../../../../../services/modulos.service';
import { MsgBoxComponent } from '../../../../shared/msg-box/msg-box.component';
import { Paginas } from '../../../../../models/paginas.model';
import { FooterFaq } from '../../../../../models/footerFaq.model';

@Component({
  selector: 'app-footerFaq-frm',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, InputTextModule, ButtonModule, DropdownModule, InputSwitchModule, DialogModule, MsgBoxComponent, EditorModule],
  templateUrl: './footerFaq-frm.component.html',
  styleUrl: './footerFaq-frm.component.css'
})
export class FooterFaqFrmComponent {
  @Input() footerFaq?: FooterFaq;
  
    formulario: FooterFaq = {
      id: 0,
    };
    
    submitted: boolean = false;
    saving: boolean = false;
    visible: boolean = false;
    msg: string = '';
    error: boolean = false;
    MsgTipo = MsgTipo;
  
    constructor(private fb: FormBuilder, private ms: MenuService, private mls: ModulosService, private router: Router) {}
  
    ngOnChanges() {
      if (this.footerFaq) {
        this.formulario = { ...this.footerFaq };
      } else {
        this.formulario = {
          id: 0,
        };
      }
    }
  
    async ngOnInit(): Promise<void> {
    }
  
    async onSubmit() {
      this.submitted = true;
      if (this.validarCamposRequeridos() && !this.saving) {
        this.saving = true;
        let response;
        if (this.formulario.id === 0) {
          this.formulario.estado = false;
          response = await this.ms.post<FooterFaq>('footerFaq', this.formulario, apis.Administrador);
        } else {
          response = await this.ms.put<FooterFaq>('footerFaq', this.formulario, apis.Administrador);
        }

        if (response) {
          if (!response.error) {
            const result = response.data;
            this.msg = 'La pregunta se ha guardado correctamente.';
            if (this.formulario.id === 0) {
              this.router.navigate([`/footerFaq/${result}`]);
            } else {
              this.router.navigate([`/footerFaq/${this.formulario.id}`]);
            }
            
          } else {
            this.msg = 'Error al guardar la pregunta. Por favor, inténtelo de nuevo.';
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
      let camposAValidar: (string | null | number | undefined)[] = [];
  
      camposAValidar = [
        this.formulario.pregunta,
        this.formulario.respuesta,
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
      this.router.navigate([`/footerFaq`]);
    }
  
    onHide(event: any): void {
      this.visible = false;
      this.router.navigate([`/footerFaq`]);
    }
}
