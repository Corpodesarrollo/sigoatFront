import { Injectable } from "@angular/core";
import { MethodsService } from "./methods.service";
import { Parametricas } from "../models/parametricas.model";
import { apis } from "../models/apis.model";
import { ResponseModel } from "../models/response.model";
import { environment } from "../../environments/environment";
import { PermisosRol } from "../models/permisosRol.model";
import { GenericService } from './generic.service';
import { User } from "./user";
import { PermisosService } from "./permisos.service";
import { Router } from "@angular/router";

@Injectable({ providedIn: 'root' })
export class AuthServices extends MethodsService {
  private permisos: PermisosRol[] | null = [];
  private user = new User();
  hasAccess: boolean = false;
  constructor(private permisosService: PermisosService, public override repos: GenericService, private router: Router) {
    super(repos); 
    const permisosGuardados = localStorage.getItem('permisos');
    if (permisosGuardados) {
      this.permisos = JSON.parse(permisosGuardados);
    }
  }

  async loadPermisos() {
    if (this.hasAccess) { return; }

    let jsonUsuario = {
      id: 1,
      rolId: 1,
      alias: 'CC51644243',
      email: 'fermanjarres3@gmail.com',
      name: 'TRES FERNANDO MANJARRES',
      state: true,
      rolCode: ['Perfil PISIS Neo','SINTRA-ENT','SECANI-CoordinadorAdmin'],
      enterpriseCode: 'CC 3216549873',
      enterpriseDeptoCode: '',
      enterpriseEmail: 'fermanjarres3@gmail.com',
      enterpriseName: 'TRES FERNANDO MANJARRES',
      enterpriseIdentification: '3216549873',
      isMinSalud: false,
      isCoordinadorAdmin: false,
      isAgenteSeguimiento: false, 
      isCuidador: true,
      isET: false,
      isEAPB: false
    };

    localStorage.setItem('user', JSON.stringify(jsonUsuario));

    if (environment.cookie) {
      try {
        const data = await this.getUser();

        if (data) {
          jsonUsuario = data;
          this.hasAccess = true;
          localStorage.setItem('user', JSON.stringify(jsonUsuario));
          console.log('✅ Usuario autenticado:', jsonUsuario);
        }
      } catch (error: any) {
        if (error.code === 401) {
          console.log('⛔ Usuario no autenticado, redirigiendo al login...');
          window.location.href = environment.url_Sispro;
        } else {
          console.error('⚠️ Otro error:', error);
        }
      }

      if (this.hasAccess) {
        console.log('✅ Acceso concedido');
      }
    } else {
      console.log('✅ Acceso concedido por ModuloGuard (sin cookie)');
      this.hasAccess = true;
      return;
    }

    console.log('⛔ Acceso denegado por ModuloGuard');
  }

  setUser(data: any) {
    localStorage.setItem('user', JSON.stringify(data));
  }

  async setPermisos() {
    await this.loadPermisos();
    let userData = localStorage.getItem('user');
    if (!userData) {
      console.error('No user data found in localStorage');
    }
    this.user = JSON.parse(userData!) as User;
    let permisosResult = await this.permisosService.getByRol(this.user.rolId as number ?? 0);
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

  async getPermisos() {
    //valida si la variable user existe en localStorage
    if (!localStorage.getItem('user')) {
      await this.loadPermisos();
    } 

    return JSON.parse(localStorage.getItem('permisos')!);
  }

  async tienePermiso(modulo: string, permiso: 'crear' | 'consultar' | 'editar' | 'eliminar'): Promise<boolean> {
    await this.setPermisos();
    this.permisos = await this.getPermisos();
    let mod = this.permisos && Array.isArray(this.permisos)
      ? this.permisos.find((m: any) => m.path.toLowerCase() === modulo.toLowerCase())
      : undefined;
    return !!mod?.[permiso];
  }
  
  async obtenerPermisos(modulo: string): Promise<{ crear: boolean, editar: boolean, eliminar: boolean }> {
    await this.setPermisos();
    this.permisos = await this.getPermisos();
    let mod = this.permisos && Array.isArray(this.permisos)
      ? this.permisos.find((m: any) => m.path.toLowerCase() === modulo.toLowerCase())
      : undefined;
    return {
      crear: !!mod?.crear,
      editar: !!mod?.editar,
      eliminar: !!mod?.eliminar
    };
  }
  
  async getUser(): Promise<any | null> {
    return await this.getAll('auth', apis.Seguridad);
  }
}