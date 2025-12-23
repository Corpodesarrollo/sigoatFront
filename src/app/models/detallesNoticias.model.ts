import { Attachment } from "./attachment.model";
import { TipoNoticia } from "./tipoNoticia.model";

export interface DetallesNoticias {
[x: string]: any;
    id: number;
    idNoticia: number | null;
    tipo: TipoNoticia | null;
    contenido: string | null;
    idTablero: number | null;
    url: string | null;
    idArchivo: number | null;
    archivo: Attachment | null;
    mimeType: string | null;
    orden: number | null;
}