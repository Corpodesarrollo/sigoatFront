import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MethodsService } from './methods.services';
import { GenericService } from './generic.services';
import { Menus } from '../models/menus.model';
import { apis } from '../models/apis.model';
import { Parametricas } from '../models/parametricas.model';
import { Tableros } from '../models/tableros.model';

@Injectable({
  providedIn: 'root'
})
export class TablerosService extends MethodsService {
  private menuCollapsedSource = new BehaviorSubject<boolean>(false);
  currentMenuState = this.menuCollapsedSource.asObservable();

  constructor(
      public override repos: GenericService,
  ) { super(repos); }

  async getList(): Promise<Parametricas[]> {
    let response = await this.getAll('tableros', apis.Administrador);
    if(!response?.error){
      return response?.data as Parametricas[];
    }
    return [];
  }

  async getTablero(id: number, idRol: number): Promise<any> {
    let response = await this.get(`tableros/${id}/${idRol}`, apis.Administrador);
    return response;
  }
}
