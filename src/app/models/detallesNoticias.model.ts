import { Attachment } from "./attachment.model";
import { TipoNoticia } from "./tipoNoticia.model";

export interface DetallesNoticias {
    id: number;
    idNoticia: number | null;
    tipo: TipoNoticia | null;
    contenido: string | null;
    url: string | null;
    idArchivo: number | null;
    archivo: Attachment | null;
    mimeType: string | null;
    orden: number | null;
}