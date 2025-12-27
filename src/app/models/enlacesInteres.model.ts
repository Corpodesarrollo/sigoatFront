export interface EnlaceInteres {
    id: number;
    idPagina?: number;
    titulo: string;
    descripcion?: string | null;
    url: string;
    target?: string | null; // '_blank' para externo, '_self' para interno
    orden?: number | null;
    estado?: boolean;
}
