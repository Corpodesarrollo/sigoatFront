import { Injectable } from '@angular/core';
import { GenericService } from './generic.services';
import { apis } from '../models/apis.model';
import { MethodsService } from './methods.services';
import { Parametricas } from '../models/parametricas.model';

@Injectable({
  providedIn: 'root'
})
export class RedesSocialesService extends MethodsService {
  constructor(
    public override repos: GenericService,
  ) { super(repos); }

  async getList(): Promise<Parametricas[]> {
    let response = await this.getAll('redesSociales', apis.Administrador);
    if(!response?.error){
      return response?.data as Parametricas[];
    }
    return [];
  }
}