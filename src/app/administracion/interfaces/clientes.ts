export interface Clientes {
    n_id:number;
    s_claveCliente:string;
    s_rfc:string;
    s_razonSocial:string;
    s_correo:string;
    n_telefono:number;
    n_limiteCredito?:number;
    n_creditoDisponible?:number;
    n_creditoUtilizado?:number;
    n_tipoCliente:number;
    n_estatus:number;
}
