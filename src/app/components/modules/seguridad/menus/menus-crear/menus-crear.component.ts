import { Component } from '@angular/core';
import { MenusFrmComponent } from "../menus-frm/menus-frm.component";

@Component({
  selector: 'app-menus-crear',
  standalone: true,
  imports: [MenusFrmComponent],
  templateUrl: './menus-crear.component.html',
  styleUrl: './menus-crear.component.css'
})
export class MenusCrearComponent {
  // Este componente simplemente utiliza el formulario de creación de Menus
  // No se requiere lógica adicional aquí, ya que toda la funcionalidad está en MenusFrmComponent
}
