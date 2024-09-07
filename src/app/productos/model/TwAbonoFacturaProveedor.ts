export class TwAbonoFacturaProveedor{
    nId: number;  // Clave primaria autogenerada
    nIdFacturaProveedor: number;  // Factura Proveedor
    nMontoAbono: number;  // Monto del abono
    dFechaAbono: Date;  // Fecha del abono
    nEstatusAbono: number;  // Estatus del abono
    nIdUsuario: number;  // ID del usuario que realizó el abono
    sNota: string;  // Nota sobre el abono
    nIdFormaPago: number;  // ID de la forma de pago
    twFacturasProveedor: TwAbonoFacturaProveedor
}