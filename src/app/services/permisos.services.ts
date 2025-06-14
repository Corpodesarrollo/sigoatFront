import { Injectable } from '@angular/core';
import { GenericService } from './generic.services';
import { Permisos } from '../models/permisos.model';
import { apis } from '../models/apis.model';
import { MethodsService } from './methods.services';
import { PermisosRol } from '../models/permisosRol.model';
import { ResponseModel } from '../models/response.model';

@Injectable({
  providedIn: 'root'
})
export class PermisosService extends MethodsService {
     constructor(
        public override repos: GenericService,
    ) { super(repos); }

    public async getByRol(idRol: number): Promise<any | null> {
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

    public async getPortal(): Promise<any | null> {
        let url = `Permisos/portal`;
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

    public async getAllByRol(idRol: number): Promise<any | null> {
        let url = `Permisos/AllByRol/${idRol}/idRol`;
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

    public async putActive(endpoint: string, data: any, api: string): Promise<ResponseModel | null> {
        let url = `Permisos/Active`;
        return new Promise((resolve) => {
            this.repos.put(url, data, api).subscribe({
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