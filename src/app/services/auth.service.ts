import { Injectable } from "@angular/core";
import { MethodsService } from "./methods.services";
import { Parametricas } from "../models/parametricas.model";
import { apis } from "../models/apis.model";
import { ResponseModel } from "../models/response.model";
import { environment } from "../../environments/environment";
import { PermisosRol } from "../models/permisosRol.model";
import { GenericService } from './generic.services';
import { User } from "./user.services";
import { PermisosService } from "./permisos.services";
import { Router } from "@angular/router";

@Injectable({ providedIn: 'root' })
export class AuthServices extends MethodsService {
  private permisos: PermisosRol[] | null = [];
  private user = new User();

  constructor(private permisosService: PermisosService, public override repos: GenericService, private router: Router) {
    super(repos); 
    const permisosGuardados = localStorage.getItem('permisos');
    if (permisosGuardados) {
      this.permisos = JSON.parse(permisosGuardados);
    }
  }

  async loadPermisos() {

    if (environment.cookie) {
      let response = await this.getUser();
      if (!response) {
        console.error('Error loading user data');
        this.setUser({});
        return;
      }
      let result = response as ResponseModel;
      if (result.error) {
        console.error('Error loading permissions:', result.dataError);
        return;
      }
      
      this.setUser(result.data);
    }
    else {
      localStorage.setItem('user', `
        {
          "Id":"1",
          "Alias":"CC51644243",
          "Email":"CHARLESROCK96@GMAIL.COM",
          "Name":"CLAUDIA MARTINEZ",
          "State":true,
          "roleId":1,
          "RolCode":[
            "Perfil PISIS Neo",
            "SINTRA-ENT"
          ],
          "EnterpriseCode":"NI 800114312",
          "EnterpriseDeptoCode":"80",
          "EnterpriseEmail":"lidertic@saluddecaldas.gov.co",
          "EnterpriseName":"DIRECCION TERRITORIAL DE SALUD DE CALDAS",
          "EnterpriseIdentification":"800114312",
          "IsMinSalud":false,
          "IsAuth":true
        }`);
    }
  }

  setUser(data: any) {
    localStorage.setItem('user', JSON.stringify(data));
  }

  async setPermisos() {
    let permisosResult = await this.permisosService.getByRol(this.user.rolId as number);
    if (permisosResult) {
      let result = permisosResult as ResponseModel;
      if (result.error) {
        console.error('Error al obtener los permisos:', permisosResult.dataError);
        return;
      } else {
        let data = result.data as PermisosRol[];
        localStorage.setItem('permisos', JSON.stringify(data));
      }
    }
    else {
      localStorage.setItem('permisos', JSON.stringify({}));
      this.router.navigate(['/no-autorizado']);
    }
  }

  getPermisos() {
    return JSON.parse(localStorage.getItem('permisos')!);
  }

  async tienePermiso(modulo: string, permiso: 'crear' | 'consultar' | 'editar' | 'eliminar'): Promise<boolean> {
    await this.setPermisos();
    this.permisos = this.getPermisos();
    let mod = this.permisos && Array.isArray(this.permisos)
      ? this.permisos.find((m: any) => m.path.toLowerCase() === modulo.toLowerCase())
      : undefined;
    return !!mod?.[permiso];
  }
  
  async getUser(): Promise<any | null> {
    return await this.getAll('auth', apis.Seguridad);
  }
}