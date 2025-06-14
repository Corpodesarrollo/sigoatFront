export interface Noticias {
    id: number;
    idPagina?: number;
    titulo?: string;
    detalle?: string;
    fecha?: Date | null;
    estado?: boolean;
}