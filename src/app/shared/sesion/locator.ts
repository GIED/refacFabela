export class locator{

// api para clientes
static obtenerClientes='/obtenerClientes';
static obtenerClienteLike='/consultaClienteLike?';
static obtenerSaldoGeneral='/consultaClienteIdSaldo?';
static consultaClienteIdUsuario='/consultaClienteIdUsuario?';
static consultaClienteRfc='/consultaClienteRfc?';
static guardarClientes='/guardarCliente';
static consultaClientesSaldos='/consultaClienteSaldo'
static consultaRegimenFiscal='/catalogoRegimenFiscal'
// api para proveedores
static obtenerProveedores='/obtenerProveedores';
static guardarProveedores='/guardarProveedores';
//api para usuarios
static obtenerUsuarios='/obtenerUsuarios';
static nuevoUsuario = '/nuevo';
static obtenerUsuariosId='/consultarUsuarioId?';
//api login
static login = '/auth/login';
static refresh= '/auth/refresh';
//api para tipoCambio
static consultaTipoCambioId='/consultaTipoCambioId';
static actualizarTipoCambio='/actualizarTipoCambio';
//api para catalogos
static consultaClaveSat='/catalogosClaveSat';
static consultaCategoriaGeneral='/catalogoCategoriaGeneral';
static consultaCategoria= '/catalogoCategoriaId?';
static consultaGanancia= '/catalogoGanancia';
static consultaGananciaId= '/catalogoGananciaId?';
static consultaFormaPago='/catalogoFormaPago';
static consultaFormaPagoId='/catalogoFormaPagoId?';
static consultaEstatusVentaId='/catalogoEstatusId?';
static consultarCajaActiva='/cajaActiva';
static consultarCajas='/consultaCajas';
static abrirCajaNueva= '/nuevaCaja?';
static consultarUsoCfdi='/catalogoUsoCfdi';
//api productos
static obtenerProductos= '/obtenerProductos';
static obtenerProductosLike= '/obtenerProductosLike?';
static consultaNoParte= '/obtenerProductosNoParteLike?';
static guardarProducto= '/guardarProducto';
static calcularPrecioProducto= '/calcularNuevoPrecio';
static obtenerHistoriaPrecioProducto='/obtenerHistoriaPrecioProducto?';
static obtenerHistoriaIngresoProducto='/obtenerHistoriaIngresoProducto?';
static obtenerSimuladorPrecioProducto='/simuladorPrecioProducto';
static obtenerTotalBodegasIdProducto='/obtenerTotalBodegasIdProducto?';
static obtenerVentaStockFecha='/obtenerVentasStockFecha?';

//productos alternativos
static obtenerProductosalternativosId='/obtenerProductosAlternativos?';
static guardarProductoAlternativo = '/guardarProductoAlternativo';
//api Bodegas
static obtenerBodegas= '/catalogoBodegas';
static obtenerProductoBodegas = '/obtenerProductoBodegas?';
//api Anaquel
static obtenerAnaqueles= '/catalogoAnaquel';
//api Nivel
static obtenerNivel= '/catalogoNivel';
//api Pedidos
static obtenerProductosPedido='/obtenerProductosPedido?';
static obtenerPedidosEstatus='/obtenerPedidosEstatus?';
static guardaPedido= '/guardarPedido';
static guardaIngresoProductoPedido= '/ingresoProductoPedido';
static generarPedidoPdf='/getPedidoId?';

//Inventario
static consultaInventario ='/obtenerInventarioEsp?';
//Api ventas
static consultaVentaDetalleEstatus='/obtenerVentasClienteDetalleEstatus?';
static consultaVentaDetalleEstatusVenta='/obtenerVentasClienteDetalleEstatusVenta?';
static consultaVentaDetalle='/obtenerVentasDetalle';
static consultaVentasLike='/obtenerVentaslike?';
static consultaVentasTop='/obtenerVentasTop';
static consultaVentaDetalleCajaVigente='/obtenerVentasCajaVigente';
static consultaVentaDetalleEntrega='/obtenerVentasDetalleEntrega'
static consultaVentaAbonoId='/obtenerAbonosVentaId?';
static obtenerVentaCobroParcial='/obtenerPagosParciales?';
static consultaProductoVentaId='/consultaProductoVentaId?';
static guardaVenta= '/guardarVenta';
static cancelaProductoVenta= '/cancelaVentaProducto';
static guardaVentaDetalle= '/guardarVentaDetalle';
static guardaVentaProductoId= '/guardaVentaProductoId';
static guardaVentaProductoEntrega= '/guardaVentasProducto';
static guardaAbono= '/guardarAbono';
static guardarMaquina= '/guardarMaquina';
static consultaProductoVentaMesId='/consultaProductoVentaMesId?';
static consultarVentaId='/obtenerVentaId?';
static consultarMaquinaCliente='/obtenerMaquinasCliente?';
static generarVentaPdf='/getVenta?';
static descargarDocuemento='/facturacion/getDocumento?';
static generarReporteCajaPdf='/getReporteCaja?';
static generarAbonoVentaPdf='/getAbonoVentaId?';
static generarHistorialAbonoVentaPdf='/getAbonoVentaIdCliente?';
static generarVentaPedidoPdf='/getVentaPedido?';

//Cotizaciones
static guardaCotizacion= '/guardarCotizacion';
static consultaCotizaciones='/consultaCotizaciones';
static consultaCotizacionesBusqueda='/consultaCotizacionesLike?';
static consultaCotizacionId='/consultaCotizacionId?';
static obtenerVentaIdcotizacon='/obtenerVentaIdCotizacion?';
static generarCotizacionPdf='/getCotizacion?';

//ventasPorInternet
static registraCotizacionInternet= '/guardaRegistroCotizacionInternet'
static guardaComprobante='/guardaComprobante';
static consultaCotizacionDistribuidor='/consultaCotizacionDistribuidor?';
static consultaPagoComprobante='/consultaPagoComprobante?'
static actualizarEstatusComprobante= '/actualizarEstatusComprobante'

//Tablero
static obtenerTotalesGeneralesTablero='/totales-generales-tablero';

//traspasos
static movimientoInterno='/movimientoInterno';
static movimientoExterno='/movimientoExterno';

//factura
static consultaVentaFactura='/facturacion/ventasParaFactura';
static facturarVenta='/facturacion/venta?';



}