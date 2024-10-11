import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MedioComponent } from './medio/medio.component';

const routes: Routes = [
  { path: 'medio', component: MedioComponent }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class PaginasRoutingModule { }
