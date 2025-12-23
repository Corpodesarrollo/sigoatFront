import { Component, Input, SimpleChanges } from '@angular/core';
import { CarruselService } from '../../../services/carrusel.service';
import { apis } from '../../../models/apis.model';
import { ResponseModel } from '../../../models/response.model';
import { Carrusel } from '../../../models/carrusel.model';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { MainSectionComponent } from "../main-section/main-section.component";
import { DocumentosComponent } from "../documentos/documentos.component";
import { CarruselComponent } from "../carrusel/carrusel.component";
import { FormBuilder } from '@angular/forms';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { MsgTipo } from '../../../models/msgTipo.model';
import { Tableros } from '../../../models/tableros.model';
import { ModulosService } from '../../../services/modulos.service';
import { TablerosService } from '../../../services/tableros.service';
import { User } from '../../../services/user';

@Component({
  selector: 'app-viewerPBI',
  standalone: true,
  imports: [CommonModule, MainSectionComponent, DocumentosComponent, CarruselComponent],
  templateUrl: './viewerPBI.component.html',
  styleUrl: './viewerPBI.component.css'
})
export class ViewerPBIComponent {
  @Input() id: number = 0;
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

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private ms: TablerosService, private mls: ModulosService, 
    private router: Router, private sanitizer: DomSanitizer) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id']) {
      this.id = changes['id'].currentValue;
      this.ngOnInit();
    }
  }

  async ngOnInit(): Promise<void> {
    console.log("Cargando ViewerPBI para el tablero con ID:", this.id);
    if (this.id === 0) {
      console.error('ID del tablero no proporcionado o inválido');
      return;
    }
    
    let response = await this.ms.getTablero(this.id ?? 0, this.user?.rolId ?? 0);
    if (response) {
      let result = response as ResponseModel;
      console.log('Respuesta del servicio getTablero:', result);
      if (result.error) {
        if (result.dataError.message == "401") {
          this.router.navigate(['/no-autorizado']);
        }
      } else {
        this.formulario = result.data as Tableros;
        console.log('Cargando URL del tablero:', this.formulario.url);
        if (this.formulario.url) {
          
          this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.formulario.url ?? '');
        } else {
          this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(''); // asignamos un SafeResourceUrl vacío si no hay URL válida
        }
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
