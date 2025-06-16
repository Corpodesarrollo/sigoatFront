import { Attachment } from "./attachment.model";
import { DetallesNoticias } from "./detallesNoticias.model";
import { TipoNoticia } from "./tipoNoticia.model";

export interface PaginaNoticia {
    idPagina?: number;
    idNoticia?: number;
    titulo?: string;
    detalle?: string;
    fecha?: Date | null;
    detalles?: DetallesNoticias[];
}