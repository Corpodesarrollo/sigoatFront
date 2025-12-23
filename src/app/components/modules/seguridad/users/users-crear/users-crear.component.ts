import { Component } from '@angular/core';
import { UsersFrmComponent } from '../users-frm/users-frm.component';

@Component({
  selector: 'app-users-crear',
  standalone: true,
  imports: [UsersFrmComponent],
  templateUrl: './users-crear.component.html',
  styleUrl: './users-crear.component.css'
})
export class UsersCrearComponent {

}
