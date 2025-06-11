import { Attachment } from "./attachment.model";

export interface Carrusel {
    id?: number | null;
    idPagina?: number | null;
    idArchivo?: number | null;
    archivo?: Attachment | null;
    mimeType?: string | null;
    url?: string | null;
    orden?: number | null;
}