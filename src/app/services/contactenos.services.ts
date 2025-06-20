import { Injectable } from '@angular/core';
import { GenericService } from './generic.services';
import { Permisos } from '../models/permisos.model';
import { apis } from '../models/apis.model';
import { MethodsService } from './methods.services';
import { PermisosRol } from '../models/permisosRol.model';
import { Parametricas } from '../models/parametricas.model';
import { Modulos } from '../models/modulos.model';
import { Contactenos } from '../models/contactenos.model';

@Injectable({
  providedIn: 'root'
})
export class ContactenosService extends MethodsService {
  constructor(
    public override repos: GenericService,
  ) { super(repos); }

  async getList(): Promise<Parametricas[]> {
    let response = await this.getAll('contactenos', apis.Administrador);
    if(!response?.error){
      return response?.data as Parametricas[];
    }
    return [];
  }
}