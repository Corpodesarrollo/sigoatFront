import { Component } from '@angular/core';
import { PaginasFrmComponent } from "../paginas-frm/paginas-frm.component";
import { StepsComponent } from "../../../../shared/steps/steps.component";

@Component({
  selector: 'app-paginas-crear',
  standalone: true,
  imports: [PaginasFrmComponent, StepsComponent],
  templateUrl: './paginas-crear.component.html',
  styleUrl: './paginas-crear.component.css'
})
export class PaginasCrearComponent {

}
