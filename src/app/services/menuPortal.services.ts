import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MethodsService } from './methods.services';
import { GenericService } from './generic.services';
import { Menus } from '../models/menus.model';
import { apis } from '../models/apis.model';
import { Parametricas } from '../models/parametricas.model';

@Injectable({
  providedIn: 'root'
})
export class MenuPortalServices extends MethodsService {  
  private menuCollapsedSource = new BehaviorSubject<boolean>(false);
  currentMenuState = this.menuCollapsedSource.asObservable();

  endpoint: string = 'menusPortal';

  constructor(
      public override repos: GenericService,
  ) { super(repos); }

  toggleMenu() {
    this.menuCollapsedSource.next(!this.menuCollapsedSource.getValue());
  }

  async getList(): Promise<Parametricas[]> {
    let response = await this.getAll<Menus>('menusPortal', apis.Seguridad);
    if(!response?.error){
      return response?.data as Parametricas[];
    }
    return [];
  }
}
