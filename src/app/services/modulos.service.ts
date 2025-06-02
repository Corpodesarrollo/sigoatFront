import { Injectable } from '@angular/core';
import { GenericService } from './generic.services';
import { Permisos } from '../models/permisos.model';
import { apis } from '../models/apis.model';
import { MethodsService } from './methods.service';
import { PermisosRol } from '../models/permisosRol.model';

@Injectable({
  providedIn: 'root'
})
export class ModulosService extends MethodsService {
     constructor(
        public override repos: GenericService,
    ) { super(repos); }
}