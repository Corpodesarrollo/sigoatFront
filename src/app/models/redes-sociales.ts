import { Attachment } from "./attachment.model";

export interface RedesSociales {
    id: number;
    idTipoRedSocial: number;
    tipoRedSocial?: string | null;
    url?: string | null;
    idImagen?: number | null;
    imagen?: Attachment | null;
}