import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MethodsService } from './methods.services';
import { GenericService } from './generic.services';
import { apis } from '../models/apis.model';
import { Parametricas } from '../models/parametricas.model';
import { Paginas } from '../models/paginas.model';

@Injectable({
  providedIn: 'root'
})
export class PaginasService extends MethodsService {
  private menuCollapsedSource = new BehaviorSubject<boolean>(false);
  currentMenuState = this.menuCollapsedSource.asObservable();

  constructor(
      public override repos: GenericService,
  ) { super(repos); }

  async getList(): Promise<Paginas[]> {
    let response = await this.getAll('paginas', apis.Administrador);
    if(!response?.error){
      return response?.data as Paginas[];
    }
    return [];
  }
}
