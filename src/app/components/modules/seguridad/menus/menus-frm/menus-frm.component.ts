import { Component, Input } from '@angular/core';
import { Menus } from '../../../../../models/menus.model';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { Parametricas } from '../../../../../models/parametricas.model';
import { MenuService } from '../../../../../services/menu.service';
import { apis } from '../../../../../models/apis.model';
import { InputSwitchModule } from 'primeng/inputswitch';
import { Router } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { ModulosService } from '../../../../../services/modulos.service';
import { MsgBoxComponent } from "../../../../shared/msg-box/msg-box.component";
import { MsgTipo } from '../../../../../models/msgTipo.model';
import { TablerosService } from '../../../../../services/tableros.service';
import { Tableros } from '../../../../../models/tableros.model';

@Component({
  selector: 'app-menus-frm',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, InputTextModule, ButtonModule, DropdownModule, InputSwitchModule, DialogModule, MsgBoxComponent],
  templateUrl: './menus-frm.component.html',
  styleUrl: './menus-frm.component.css'
})
export class MenusFrmComponent {
  @Input() menu?: Menus;

  formulario: Menus = {
    id: 0,
    nombre: '',
    grupo: '',
    orden: 0,
    idMenu: 0,
    idModulo: 0,
    idTablero: 0,
    estado: true,
  };

  menus: Parametricas[] = [];
  modulos: Parametricas[] = [];
  tableros: Tableros[] = [];

  selectedMenu: Parametricas | undefined;
  selectedModulo: Parametricas | undefined;
  selectedTablero: Tableros | undefined;

  isLoadingMenus: boolean = true;
  isLoadingModulos: boolean = true;
  isLoadingTableros: boolean = true;
  submitted: boolean = false;
  saving: boolean = false;
  visible: boolean = false;
  msg: string = '';
  error: boolean = false;
  MsgTipo = MsgTipo;

  constructor(private fb: FormBuilder, private ms: MenuService, private mls: ModulosService, private ts: TablerosService, private router: Router) {}

  ngOnChanges() {
    if (this.menu) {
      this.formulario = { ...this.menu };
      this.selectedMenu = this.menus.find(m => m.id === this.formulario.idMenu);
      this.selectedModulo = this.modulos.find(m => m.id === this.formulario.idModulo);
      this.selectedTablero = this.tableros.find(t => t.id === this.formulario.idTablero);
    } else {
      this.formulario = {
        id: 0,
        nombre: '',
        grupo: '',
        orden: 0,
        idMenu: 0,
        idModulo: 0,
        idTablero: 0,
        estado: true,
      };
      this.selectedMenu = undefined;
      this.selectedModulo = undefined;
    }
  }

  async ngOnInit(): Promise<void> {
    this.menus = await this.ms.getList();
    this.isLoadingMenus = false;

    this.modulos = await this.mls.getList();
    this.isLoadingModulos = false;

    this.tableros = await this.ts.getList();
    this.isLoadingTableros = false;

    this.selectedMenu = this.menus.find(m => m.id === this.formulario.idMenu);
    this.selectedModulo = this.modulos.find(m => m.id === this.formulario.idModulo);
    this.selectedTablero = this.tableros.find(t => t.id === this.formulario.idTablero);
  }

  async onSubmit() {
    this.submitted = true;
    if (this.validarCamposRequeridos() && !this.saving) {
      this.saving = true;
      let result;
      if (this.formulario.id === 0) {
        result = await this.ms.post<Menus>('menus', this.formulario, apis.Seguridad);
      } else {
        result = await this.ms.put<Menus>('menus', this.formulario, apis.Seguridad);
      }

      if (!result?.error) {
        this.msg = 'El menú se ha guardado correctamente.';
      } else {
        this.msg = 'Error al guardar el menú. Por favor, inténtelo de nuevo.';
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
    this.formulario.idMenu = this.selectedMenu?.id ?? 0;
    this.formulario.idModulo = this.selectedModulo?.id ?? 0;
    this.formulario.idTablero = this.selectedTablero?.id ?? 0;
    
    let camposAValidar: (string | number | undefined)[] = [];

    camposAValidar = [
      this.formulario.nombre,
      this.formulario.orden,
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
    this.router.navigate([`/menus`]);
  }

  onHide(event: any): void {
    this.visible = true;
    this.router.navigate([`/menus`]);
  }
}
