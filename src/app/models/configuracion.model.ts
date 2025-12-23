import { Attachment } from "./attachment.model";

export interface Configuracion {
    id: number;
    redesSociales: boolean;
    colorGovCo: string | null;
    colorPrincipal: string | null;
    idLogoIzquierdo: number | null;
    logoIzquierdo: Attachment | null;
    idLogoDerecho: number | null;
    logoDerecho: Attachment | null;}