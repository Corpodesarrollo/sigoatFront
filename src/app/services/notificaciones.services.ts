import { Injectable } from '@angular/core';
import { GenericService } from './generic.services';
import { Permisos } from '../models/permisos.model';
import { apis } from '../models/apis.model';
import { MethodsService } from './methods.services';
import { PermisosRol } from '../models/permisosRol.model';
import { Parametricas } from '../models/parametricas.model';
import { Notificacion } from '../models/notificaciones.model';

@Injectable({
  providedIn: 'root'
})
export class NotificacionesServices extends MethodsService {
  
  constructor(
    public override repos: GenericService,
  ) { super(repos); }

  async getList(): Promise<Parametricas[]> {
    let response = await this.getAll('notificaciones', apis.Administrador);
    if(!response?.error){
      return response?.data as Parametricas[];
    }
    return [];
  }

  async obtenerNotificaciones(id: number): Promise<any> {
    let response = await this.getAll(`notificaciones/${id}/idUser`, apis.Administrador);
    return response;
  }

  async marcarNotificacion(id: number, idUser: number) {
    let response = await this.getAll(`notificaciones/${id}/idNot/${idUser}/idUser`, apis.Administrador);
    return response;
  }
}