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
import { TablerosService } from '../../../../../services/tableros.services';
import { TablerosFrmComponent } from "../tableros-frm/tableros-frm.component";

@Component({
  selector: 'app-tableros-editar',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, InputTextModule, ButtonModule, DropdownModule, InputSwitchModule, DialogModule, MsgBoxComponent, TablerosFrmComponent],
  templateUrl: './tableros-editar.component.html',
  styleUrl: './tableros-editar.component.css'
})
export class TablerosEditarComponent {
  id:number | undefined;
    tablero!: Tableros;
  
    constructor(private route: ActivatedRoute, private ms: TablerosService) {
      this.route.paramMap.subscribe(params => {
        const idParam = params.get('id');
        this.id = idParam ? +idParam : undefined;
      });
    }
  
    async ngOnInit() {
      if (this.id === undefined) {
        console.error('ID del tablero no proporcionado o inválido');
        return;
      }
      
      let respose = await this.ms.getById('tableros', this.id, apis.Administrador);
      if(respose?.error) {
        console.error('Error al obtener el Tablero:', respose.error);
        return;
      } else {
        this.tablero = respose?.data as Tableros;
      }
    }
}
