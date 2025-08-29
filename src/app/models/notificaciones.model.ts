import { AudienciaTipo } from "./audienciaTipo.model";

export interface Notificacion {
    id?: number;
    titulo?: string;
    contenido?: string;
    tipoEvento?: number;
    audiencia?: number;
    fechaInicio?: Date | null;
    fechaFin?: Date | null;
    leido?: boolean;
    estado?: boolean;
}
