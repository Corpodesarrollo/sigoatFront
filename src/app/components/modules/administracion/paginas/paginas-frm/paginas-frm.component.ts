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
import { Paginas } from '../../../../../models/paginas.model';

@Component({
  selector: 'app-paginas-frm',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, InputTextModule, ButtonModule, DropdownModule, InputSwitchModule, DialogModule, MsgBoxComponent],
  templateUrl: './paginas-frm.component.html',
  styleUrl: './paginas-frm.component.css'
})
export class PaginasFrmComponent {
  @Input() pagina?: Paginas;
  
    formulario: Paginas = {
      id: 0,
      idioma: '',
      titulo: '',
      detalle: '',
      url: '',
      estado: true,
    };

    idiomas: Parametricas[] = [];
    selectedIdioma: Parametricas | null = null;
    isLoadingIdiomas: boolean = false;
    
    submitted: boolean = false;
    saving: boolean = false;
    visible: boolean = false;
    msg: string = '';
    error: boolean = false;
    MsgTipo = MsgTipo;
  
    constructor(private fb: FormBuilder, private ms: MenuService, private mls: ModulosService, private router: Router) {}
  
    ngOnChanges() {
      if (this.pagina) {
        this.formulario = { ...this.pagina };
      } else {
        this.formulario = {
          id: 0,
          idioma: '',
          titulo: '',
          detalle: '',
          url: '',
          estado: true,
        };
      }
    }
  
    async ngOnInit(): Promise<void> {
      this.idiomas = [{
        id: 0,
        codigo: 'Español',
        nombre: 'Español'
      },{
        id: 1,
        codigo: 'Inglés',
        nombre: 'Inglés'
      }, {
        id: 2,
        codigo: 'Francés',
        nombre: 'Francés'
      }]

      this.selectedIdioma = this.idiomas.find(idioma => idioma.codigo === 'Español') || null;
    }
  
    async onSubmit() {
      this.submitted = true;
      if (this.validarCamposRequeridos() && !this.saving) {
        this.saving = true;
        let result;
        if (this.formulario.id === 0) {
          result = await this.ms.post<Paginas>('paginas', this.formulario, apis.Seguridad);
        } else {
          result = await this.ms.put<Paginas>('paginas', this.formulario, apis.Seguridad);
        }
  
        if (!result?.error) {
          this.msg = 'La página se ha guardado correctamente.';
        } else {
          this.msg = 'Error al guardar la página . Por favor, inténtelo de nuevo.';
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
        this.formulario.idioma,
        this.formulario.titulo,
        this.formulario.detalle,
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
      this.router.navigate([`/paginas`]);
    }
  
    onHide(event: any): void {
      this.visible = true;
      this.router.navigate([`/paginas`]);
    }
}
