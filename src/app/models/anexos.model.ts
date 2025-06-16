import { Attachment } from "./attachment.model";

export interface Anexos {
    id?: number;
    codigo?: string | null;
    nombre?: string | null;
    idPagina?: number | null;
    idArchivo?: number | null;
    archivo?: Attachment | null;
    mimeType?: string | null;
    formato?: string | null;
}