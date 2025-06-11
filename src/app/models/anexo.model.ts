import { Attachment } from "./attachment.model";

export interface Anexo {
    codigo?: string | null;
    nombre?: string | null;
    idPagina?: number | null;
    idArchivo?: number | null;
    estado?: boolean;
    archivo?: Attachment | null;
}