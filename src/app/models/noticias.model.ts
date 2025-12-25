import { Attachment } from "./attachment.model";

export interface Noticias {
    id: number;
    idPagina?: number;
    titulo?: string;
    resumen?: string | null;
    enlace?: string | null;
    target?: string | null;
    posicion?: number | null;
    idImagen?: number | null;
    imagen: Attachment | null;
    mimeType: string | null;
    urlRecurso?: string | null;
    fecha?: Date | null;
    orden?: number | null;
    estado?: boolean;
}