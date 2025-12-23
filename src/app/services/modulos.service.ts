import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Permisos } from '../models/permisos.model';
import { apis } from '../models/apis.model';
import { MethodsService } from './methods.service';
import { PermisosRol } from '../models/permisosRol.model';
import { Parametricas } from '../models/parametricas.model';
import { Modulos } from '../models/modulos.model';

@Injectable({
  providedIn: 'root'
})
export class ModulosService extends MethodsService {
  constructor(
    public override repos: GenericService,
  ) { super(repos); }

  async getList(): Promise<Parametricas[]> {
    let response = await this.getAll('modulos', apis.Seguridad);
    if(!response?.error){
      return response?.data as Parametricas[];
    }
    return [];
  }
}