export class locator{

// api para clientes
static obtenerClientes='/obtenerClientes';
static obtenerClienteLike='/consultaClienteLike?';
static obtenerSaldoGeneral='/consultaClienteIdSaldo?';
static consultaClienteIdUsuario='/consultaClienteIdUsuario?';
static guardarClientes='/guardarCliente';
static consultaClientesSaldos='/consultaClienteSaldo'
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
//api productos
static obtenerProductos= '/obtenerProductos';
static obtenerProductosLike= '/obtenerProductosLike?';
static consultaNoParte= '/obtenerProductosNoParteLike?';
static guardarProducto= '/guardarProducto';
static obtenerHistoriaPrecioProducto='/obtenerHistoriaPrecioProducto?';
static obtenerSimuladorPrecioProducto='/simuladorPrecioProducto';
static obtenerTotalBodegasIdProducto='/obtenerTotalBodegasIdProducto?';
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

//Inventario
static consultaInventario ='/obtenerInventarioEsp?';
//Api ventas
static consultaVentaDetalleEstatus='/obtenerVentasClienteDetalleEstatus?';
static consultaVentaDetalleEstatusVenta='/obtenerVentasClienteDetalleEstatusVenta?';
static consultaVentaDetalle='/obtenerVentasDetalle';
static consultaVentaDetalleEntrega='/obtenerVentasDetalleEntrega'
static consultaVentaAbonoId='/obtenerAbonosVentaId?';
static consultaProductoVentaId='/consultaProductoVentaId?';
static guardaVenta= '/guardarVenta';
static guardaVentaDetalle= '/guardarVentaDetalle';
static guardaVentaProductoId= '/guardaVentaProductoId';
static guardaVentaProductoEntrega= '/guardaVentasProducto';
static guardaAbono= '/guardarAbono';
static consultaProductoVentaMesId='/consultaProductoVentaMesId?';
static consultarVentaId='/obtenerVentaId?';
static generarVentaPdf='/getVenta?';
static generarAbonoVentaPdf='/getAbonoVentaId?';
static generarHistorialAbonoVentaPdf='/getAbonoVentaIdCliente?';
static generarVentaPedidoPdf='/getVentaPedido?';

//Cotizaciones
static guardaCotizacion= '/guardarCotizacion';
static consultaCotizaciones='/consultaCotizaciones';
static consultaCotizacionId='/consultaCotizacionId?';
static generarCotizacionPdf='/getCotizacion?';

//ventasPorInternet
static registraCotizacionInternet= '/guardaRegistroCotizacionInternet'
static guardaComprobante='/guardaComprobante';
static consultaCotizacionDistribuidor='/consultaCotizacionDistribuidor?';
static consultaPagoComprobante='/consultaPagoComprobante?'
static actualizarEstatusComprobante= '/actualizarEstatusComprobante'

//Tablero
static obtenerTotalesGeneralesTablero='/totales-generales-tablero';



}