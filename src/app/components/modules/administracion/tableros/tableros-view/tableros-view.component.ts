import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { apis } from '../../../../../models/apis.model';
import { MsgTipo } from '../../../../../models/msgTipo.model';
import { Tableros } from '../../../../../models/tableros.model';
import { MenuService } from '../../../../../services/menu.services';
import { ModulosService } from '../../../../../services/modulos.services';
import { MsgBoxComponent } from '../../../../shared/msg-box/msg-box.component';
import * as pbi from 'powerbi-client';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { User } from '../../../../../services/user.services';
import { TablerosService } from '../../../../../services/tableros.services';
import { ResponseModel } from '../../../../../models/response.model';

@Component({
  selector: 'app-tableros-view',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, InputTextModule, ButtonModule, DropdownModule, InputSwitchModule, DialogModule, MsgBoxComponent],
  templateUrl: './tableros-view.component.html',
  styleUrl: './tableros-view.component.css'
})
export class TablerosViewComponent {
  id?: number = 0;
  urlSafe!: SafeResourceUrl;
  user = new User();
    
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

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private ms: TablerosService, private mls: ModulosService, private router: Router, private sanitizer: DomSanitizer) {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      this.id = idParam ? +idParam : undefined;
    });
  }

  ngOnChanges() {

  }

  async ngOnInit(): Promise<void> {
    if (this.id === undefined || this.id === 0) {
      console.error('ID del tablero no proporcionado o inválido');
      return;
    }
    
    let response = await this.ms.getTablero(this.id, this.user?.rolId ?? 0);
    if (response) {
      let result = response as ResponseModel;
      if (result.error) {
        if (result.dataError.message == "401") {
          this.router.navigate(['/no-autorizado']);
        }
      } else {
        this.formulario = result.data as Tableros;
        this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.formulario.url ?? '');
      }
    }
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
