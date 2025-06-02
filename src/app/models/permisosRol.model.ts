export interface PermisosRol {
    id: number;
    idRol?: string;
    idMenu: string;
    nombreMenu?: string;
    nombreMenuPadre?: string;
    nombreModulo?: string;
    grupo?: string;
    orden?: number;
    crear: boolean;
    consultar: boolean;
    editar: boolean;
    eliminar: boolean;
}