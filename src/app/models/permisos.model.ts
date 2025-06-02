export interface Permisos {
    id: number;
    idRol?: string;
    idMenu?: string;
    crear?: boolean;
    consultar?: boolean;
    editar?: boolean;
    eliminar?: boolean;
}