export interface PermisosRol {
    id: number;
    idRol?: number;
    idMenu: number;
    nombreMenu?: string;
    idMenuPadre?: number;
    nombreMenuPadre?: string;
    nombreModulo?: string;
    path?: string;
    grupo?: string;
    orden?: number;
    crear: boolean;
    consultar: boolean;
    editar: boolean;
    eliminar: boolean;
}