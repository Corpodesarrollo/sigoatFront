import { Injectable } from '@angular/core';
import { GenericService } from './generic.services';
import { Permisos } from '../models/permisos.model';
import { apis } from '../models/apis.model';
import { MethodsService } from './methods.service';
import { PermisosRol } from '../models/permisosRol.model';

@Injectable({
  providedIn: 'root'
})
export class PermisosService extends MethodsService {
     constructor(
        public override repos: GenericService,
    ) { super(repos); }

    public async getByRol(idRol: number): Promise<PermisosRol[] | null> {
        let url = `Permisos/Rol/${idRol}/idRol`;
        return new Promise((resolve) => {
            this.repos.get(url, ``, apis.Seguridad).subscribe({
                next: (data: any) => {
                    resolve(data);
                },
                error: (err) => {
                    console.error(err);
                    resolve(null);
                }
            });
        });
    }
}