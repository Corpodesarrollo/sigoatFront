import { Attachment } from "./attachment.model";
import { DetallesNoticias } from "./detallesNoticias.model";
import { TipoNoticia } from "./tipoNoticia.model";

export interface PaginaNoticia {
    idPagina?: number;
    idNoticia?: number;
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
    detalles?: DetallesNoticias[];
}