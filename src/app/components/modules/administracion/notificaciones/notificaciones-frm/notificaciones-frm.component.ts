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
import { Tableros } from '../../../../../models/tableros.model';
import { MenuService } from '../../../../../services/menu.service';
import { ModulosService } from '../../../../../services/modulos.service';
import { TablerosService } from '../../../../../services/tableros.service';
import { MsgBoxComponent } from '../../../../shared/msg-box/msg-box.component';
import { Notificacion } from '../../../../../models/notificaciones.model';
import { CalendarModule } from 'primeng/calendar';
import { EditorModule } from 'primeng/editor';
import { NotificacionesServices } from '../../../../../services/notificaciones.service';
import { AudienciaTipo } from '../../../../../models/audienciaTipo.model';

@Component({
  selector: 'app-notificaciones-frm',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, InputTextModule, ButtonModule, DropdownModule, InputSwitchModule, DialogModule, MsgBoxComponent, CalendarModule, EditorModule],
  templateUrl: './notificaciones-frm.component.html',
  styleUrl: './notificaciones-frm.component.css'
})
export class NotificacionesFrmComponent {
  @Input() notificacion?: Notificacion;
  
    formulario: Notificacion = {
      id: 0,
      titulo: '',
      contenido: '',
      tipoEvento: undefined,
      audiencia: undefined,
      fechaInicio: null,
      fechaFin: null,
      estado: true,
    };

    //tipo de evento (actualización, mantenimiento, novedad)
    tipoEvento: Parametricas[] = [
      { id: 0, nombre: 'Actualización' },
      { id: 1, nombre: 'Mantenimiento' },
      { id: 2, nombre: 'Novedad' }
    ];
    selectedTipoEvento: Parametricas | undefined;
    isLoadingTipoEvento: boolean = true;

    audiencias: Parametricas[] = [{ id: 0, nombre: 'Ambos' }, { id: 1, nombre: 'Internos' }, { id: 2, nombre: 'Externos' }];
    selectedAudiencia: Parametricas | undefined;
    isLoadingAudiencias: boolean = true;

    submitted: boolean = false;
    saving: boolean = false;
    visible: boolean = false;
    msg: string = '';
    error: boolean = false;
    MsgTipo = MsgTipo;
  
    constructor(private fb: FormBuilder, private ms: NotificacionesServices, private mls: ModulosService, private ts: TablerosService, private router: Router) {}
  
    ngOnChanges() {
      if (this.notificacion) {
        this.formulario = { ...this.notificacion };
        this.selectedTipoEvento = this.tipoEvento.find(te => te.id === this.formulario.tipoEvento);
        this.selectedAudiencia = this.audiencias.find(a => a.id === this.formulario.audiencia);
        this.formulario.fechaInicio = this.formulario.fechaInicio ? new Date(this.formulario.fechaInicio) : null;
        this.formulario.fechaFin = this.formulario.fechaFin ? new Date(this.formulario.fechaFin) : null;
      } else {
        this.formulario = {
          id: 0,
          titulo: '',
          contenido: '',
          tipoEvento: undefined,
          audiencia: undefined,
          fechaInicio: null,
          fechaFin: null,
          estado: true,
        };
      }
      this.isLoadingAudiencias = false;
    }
  
    async ngOnInit(): Promise<void> {
    }
  
    async onSubmit() {
      this.submitted = true;
      if (this.validarCamposRequeridos() && !this.saving) {
        this.saving = true;
        let result;
        if (this.formulario.id === 0) {
          result = await this.ms.post<Notificacion>('notificaciones', this.formulario, apis.Administrador);
        } else {
          result = await this.ms.put<Notificacion>('notificaciones', this.formulario, apis.Administrador);
        }
  
        if (!result?.error) {
          this.msg = 'La notificación se ha guardado correctamente.';
        } else {
          this.msg = 'Error al guardar La notificación. Por favor, inténtelo de nuevo.';
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
      let camposAValidar: (string | number | Date | boolean | null | undefined)[] = [];
      if (this.selectedAudiencia) {
        this.formulario.audiencia = this.selectedAudiencia.id;
      } else {
        this.formulario.audiencia = undefined;
      }
      if (this.selectedTipoEvento) {
        this.formulario.tipoEvento = this.selectedTipoEvento.id;
      } else {
        this.formulario.tipoEvento = undefined;
      }
      console.log('Audiencia seleccionada:', this.formulario.audiencia);
      console.log('Formulario antes de la validación:', this.formulario);
  
      camposAValidar = [
        this.formulario.titulo,
        this.formulario.contenido,
        this.formulario.tipoEvento,
        this.formulario.audiencia,
        this.formulario.fechaInicio,
        this.formulario.fechaFin,
        this.formulario.estado
      ];
      
      let pos = 0;
      for (const campo of camposAValidar) {
        pos++;
        if (campo === null || campo === undefined || campo.toString().trim() === '') {
          console.log('Campo requerido vacío:', campo);
          console.log('Posición:', pos);
          return false;
        }
      }
  
      return true;
    }
  
    cancelar(): void {
      this.router.navigate([`/notificaciones`]);
    }
  
    onHide(event: any): void {
      this.visible = true;
      this.router.navigate([`/notificaciones`]);
    }
}
