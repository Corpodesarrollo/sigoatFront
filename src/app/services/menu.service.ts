import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MethodsService } from './methods.service';
import { GenericService } from './generic.services';
import { Menus } from '../models/menus.model';
import { apis } from '../models/apis.model';
import { Parametricas } from '../models/parametricas.model';

@Injectable({
  providedIn: 'root'
})
export class MenuService extends MethodsService {
  private menuCollapsedSource = new BehaviorSubject<boolean>(false);
  currentMenuState = this.menuCollapsedSource.asObservable();

  constructor(
      public override repos: GenericService,
  ) { super(repos); }

  toggleMenu() {
    this.menuCollapsedSource.next(!this.menuCollapsedSource.getValue());
  }

  async getList(): Promise<Parametricas[]> {
    let response = await this.getAll<Menus>('menus', apis.Seguridad);
    if(!response?.error){
      return response?.data as Parametricas[];
    }
    return [];
  }
}
