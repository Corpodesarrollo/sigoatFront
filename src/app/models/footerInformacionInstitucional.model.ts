import { Attachment } from "./attachment.model";

export interface FooterInformacionInstitucional {
    id?: number;
    direccion?: string;
    telefonos?: string;
    horarios?: string;
    correos?: string;
    enlaceTwitter?: string;
    enlaceFacebook?: string;
    enlaceInstagram?: string;
    enlaceYouTube?: string;
    enlaceContactenos?: string;
    idLogoOficial: number | null;
    logoOficial: Attachment | null;
    mimeType: string | null;
    colorPrimario?: string;
    colorSecundario?: string;
    tipografia?: string;
    colorFuentePrimaria?: string;
    colorFuenteSecundaria?: string;
}