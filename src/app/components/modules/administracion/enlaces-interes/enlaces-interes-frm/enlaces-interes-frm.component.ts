import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { apis } from '../../../../../models/apis.model';
import { EnlaceInteres } from '../../../../../models/enlacesInteres.model';
import { EnlacesInteresService } from '../../../../../services/enlacesInteres.service';
import { ResponseModel } from '../../../../../models/response.model';
import { MsgBoxComponent } from '../../../../shared/msg-box/msg-box.component';

@Component({
  selector: 'app-enlaces-interes-frm',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, InputTextModule, InputTextareaModule,
    InputNumberModule, ButtonModule, DropdownModule, InputSwitchModule, 
    DialogModule, ToastModule
  ],
  templateUrl: './enlaces-interes-frm.component.html',
  styleUrl: './enlaces-interes-frm.component.css',
  providers: [MessageService]
})
export class EnlacesInteresFrmComponent implements OnInit {
  @Input() enlace?: EnlaceInteres;
  
  formulario!: FormGroup;
  modoEdicion: boolean = false;
  cargando: boolean = false;
  guardando: boolean = false;
  
  opcionesTarget = [
    { label: 'Interno (dentro de SIGOATS)', value: '_self', icon: 'pi pi-home' },
    { label: 'Externo (nueva ventana)', value: '_blank', icon: 'pi pi-external-link' }
  ];

  constructor(
    private fb: FormBuilder,
    private enlacesService: EnlacesInteresService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {
    this.inicializarFormulario();
  }

  async ngOnInit(): Promise<void> {
    // Verificar si estamos en modo edición
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'crear') {
      this.modoEdicion = true;
      await this.cargarEnlace(parseInt(id));
    } else if (this.enlace) {
      // Si se pasa un enlace como Input
      this.modoEdicion = true;
      this.cargarDatosEnFormulario(this.enlace);
    }
  }

  private inicializarFormulario(): void {
    this.formulario = this.fb.group({
      id: [0],
      titulo: ['', [Validators.required, Validators.maxLength(200)]],
      descripcion: ['', [Validators.maxLength(500)]],
      url: ['', [Validators.required, Validators.pattern(/^https?:\/\/.+/)]],
      target: ['_self', [Validators.required]],
      orden: [1, [Validators.min(1), Validators.max(999)]],
      estado: [true, [Validators.required]],
      idPagina: [1] // Por defecto página principal
    });
  }

  private async cargarEnlace(id: number): Promise<void> {
    this.cargando = true;
    try {
      const response = await this.enlacesService.getById('enlacesInteres', id, apis.Administrador);
      if (response && !response.error) {
        const enlace: EnlaceInteres = response.data;
        this.cargarDatosEnFormulario(enlace);
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar el enlace seleccionado.'
        });
        this.volver();
      }
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error al cargar los datos del enlace.'
      });
      this.volver();
    } finally {
      this.cargando = false;
    }
  }

  private cargarDatosEnFormulario(enlace: EnlaceInteres): void {
    this.formulario.patchValue({
      id: enlace.id,
      titulo: enlace.titulo,
      descripcion: enlace.descripcion,
      url: enlace.url,
      target: enlace.target || '_self',
      orden: enlace.orden || 1,
      estado: enlace.estado !== false, // Por defecto true
      idPagina: enlace.idPagina || 1
    });
  }

  async guardar(): Promise<void> {
    if (this.formulario.invalid) {
      this.marcarCamposInvalidos();
      this.messageService.add({
        severity: 'warn',
        summary: 'Formulario inválido',
        detail: 'Por favor, complete todos los campos requeridos correctamente.'
      });
      return;
    }

    this.guardando = true;
    try {
      const datos: EnlaceInteres = this.formulario.value;
      let response: ResponseModel | null;

      if (this.modoEdicion) {
        response = await this.enlacesService.put('enlacesInteres', datos, apis.Administrador);
      } else {
        response = await this.enlacesService.post('enlacesInteres', datos, apis.Administrador);
      }

      if (response && !response.error) {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: `Enlace ${this.modoEdicion ? 'actualizado' : 'creado'} correctamente.`
        });
        
        // Esperar un momento antes de volver
        setTimeout(() => {
          this.volver();
        }, 2000);
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: response?.dataError?.message || `No se pudo ${this.modoEdicion ? 'actualizar' : 'crear'} el enlace.`
        });
      }
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: `Error al ${this.modoEdicion ? 'actualizar' : 'crear'} el enlace.`
      });
    } finally {
      this.guardando = false;
    }
  }

  private marcarCamposInvalidos(): void {
    Object.keys(this.formulario.controls).forEach(key => {
      const control = this.formulario.get(key);
      if (control && control.invalid) {
        control.markAsTouched();
      }
    });
  }

  volver(): void {
    this.router.navigate(['/enlaces-interes']);
  }

  // Métodos auxiliares para validaciones
  esCampoInvalido(campo: string): boolean {
    const control = this.formulario.get(campo);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  obtenerMensajeError(campo: string): string {
    const control = this.formulario.get(campo);
    if (!control || !control.errors) return '';

    const errors = control.errors;
    
    if (errors['required']) return `El campo ${campo} es requerido.`;
    if (errors['maxlength']) return `El campo ${campo} excede la longitud máxima permitida.`;
    if (errors['pattern'] && campo === 'url') return 'La URL debe comenzar con http:// o https://';
    if (errors['min']) return `El valor mínimo es ${errors['min'].min}.`;
    if (errors['max']) return `El valor máximo es ${errors['max'].max}.`;
    
    return 'Campo inválido.';
  }

  onUrlChange(): void {
    const urlControl = this.formulario.get('url');
    const targetControl = this.formulario.get('target');
    
    if (urlControl && targetControl) {
      const url = urlControl.value;
      if (url && url.includes(window.location.hostname)) {
        // Si la URL contiene el dominio actual, sugerir interno
        targetControl.setValue('_self');
      }
    }
  }

  probarEnlace(): void {
    const url = this.formulario.get('url')?.value;
    const target = this.formulario.get('target')?.value;
    
    if (url) {
      if (target === '_blank') {
        window.open(url, '_blank');
      } else {
        window.open(url, '_self');
      }
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'URL requerida',
        detail: 'Ingrese una URL para poder probarla.'
      });
    }
  }
}