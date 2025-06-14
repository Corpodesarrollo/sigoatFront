import { Component } from '@angular/core';
import { MenusFrmComponent } from '../../menus/menus-frm/menus-frm.component';
import { MenusPortalFrmComponent } from "../menus-portal-frm/menus-portal-frm.component";

@Component({
  selector: 'app-menus-portal-crear',
  standalone: true,
  imports: [MenusFrmComponent, MenusPortalFrmComponent],
  templateUrl: './menus-portal-crear.component.html',
  styleUrl: './menus-portal-crear.component.css'
})
export class MenusPortalCrearComponent {

}
