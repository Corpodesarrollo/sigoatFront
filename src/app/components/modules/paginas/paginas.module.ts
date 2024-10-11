import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { PaginasRoutingModule } from './paginas-routing.module';
import { MedioComponent } from './medio/medio.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PaginasRoutingModule,
    RouterModule,
    CheckboxModule,
    FormsModule,
    CommonModule,
    TableModule,
    CardModule,
    MedioComponent
  ]
})
export class PaginasModule { }
