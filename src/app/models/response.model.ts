
export interface ResponseModel {
    data?: any; // Puede ser de cualquier tipo, dependiendo de la respuesta
    dataError?: any; // Puede ser de cualquier tipo, dependiendo del error
    error?: boolean; // Indica si hubo un error en la respuesta
    ok: boolean; // Indica si la respuesta fue exitosa
}