import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-en-mantenimiento',
  standalone: true,
  imports: [],
  templateUrl: './en-mantenimiento.component.html',
  styleUrl: './en-mantenimiento.component.css'
})
export class EnMantenimientoComponent {
  constructor(private router: Router) {}

  volverInicio() {
    this.router.navigate(['/portal']);
  }

}
