import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthServices } from './auth.service';

@Injectable({ providedIn: 'root' })
export class ModuloGuard implements CanActivate {
  constructor(private auth: AuthServices, private router: Router) {}

  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    const modulo = route.data['modulo'] as string;
    const permiso = route.data['permiso'] as 'consultar' | 'crear' | 'editar' | 'eliminar';

    if (modulo === 'home'){
      await this.auth.setPermisos();
      return true;
    }

    const tienePermiso = await this.auth.tienePermiso(modulo, permiso);
    if (!tienePermiso) {
      this.router.navigate(['/no-autorizado']);
    }

    return tienePermiso;
  }
}