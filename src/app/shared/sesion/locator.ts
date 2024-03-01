export class locator{

// api para clientes
static obtenerClientes='/obtenerClientes';
static obtenerClienteLike='/consultaClienteLike?';
static obtenerCpLike='/catalogoCp?';
static consultaClienteId='/consultaClienteId?'
static obtenerSaldoGeneral='/consultaClienteIdSaldo?';
static consultaClienteIdUsuario='/consultaClienteIdUsuario?';
static consultaClienteRfc='/consultaClienteRfc?';
static guardarClientes='/guardarCliente';
static consultaClientesSaldos='/consultaClienteSaldo'
static consultaRegimenFiscal='/catalogoRegimenFiscal'
static consultaCatalogoRazonSocial='/catalogosDatoFactura'
// api para proveedores
static obtenerProveedores='/obtenerProveedores';
static guardarProveedores='/guardarProveedores';
//api para usuarios
static obtenerUsuarios='/obtenerUsuarios';
static nuevoUsuario = '/nuevo';
static guardarUsuario = '/guardarUsuario';
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
static consultaGastosCaja='/gastosCaja?';
static obtenerCatalogoGastos='/catalogoGasto';
static consultaEstatusVentaId='/catalogoEstatusId?';
static consultarCajaActiva='/cajaActiva';
static consultarCajas='/consultaCajas';
static abrirCajaNueva= '/nuevaCaja?';
static consultarMarcas= '/catalogoMarca';
static consultarUsoCfdi='/catalogoUsoCfdi';
//api productos
static obtenerProductos= '/obtenerProductos';
static obtenerProductoId= '/obtenerProductoId?';
static obtenerProductosLike= '/obtenerProductosLike?';
static consultaNoParte= '/obtenerProductosNoParteLike?';
static guardarProducto= '/guardarProducto';
static guardarGasto= '/guardarGasto';
static borrarGasto= '/borrarGasto';
static guardarProductoGeneral= '/guardarProductoGeneral';

static calcularPrecioProducto= '/calcularNuevoPrecio';
static obtenerHistoriaPrecioProducto='/obtenerHistoriaPrecioProducto?';
static obtenerHistoriaIngresoProducto='/obtenerHistoriaIngresoProducto?';
static obtenerHistorialStockProducto='/obtenerHistorialStockProducto?';
static obtenerProductosCaneladosId='/obtenerProductosCancelaId?';

static obtenerSimuladorPrecioProducto='/simuladorPrecioProducto';
static obtenerTotalBodegasIdProducto='/obtenerTotalBodegasIdProducto?';
static obtenerVentaStockFecha='/obtenerVentasStockFecha?';
static obtenerVentasCancelaFecha='/obtenerProductosCanceladosFecha?';
static obtenerProductosAjustadosFecha='/obtenerProductosAjusteFecha?';


//productos alternativos
static obtenerProductosalternativosId='/obtenerProductosAlternativos?';
static obtenerProductosalternativosIdDescuento='/obtenerProductosAlternativosDescuento?';
static guardarProductoAlternativo = '/guardarProductoAlternativo';
//api Bodegas
static obtenerBodegas= '/catalogoBodegas';
static obtenerProductoBodegas = '/obtenerProductoBodegas?';
static obtenerProductoBodega = '/obtenerProductoBodega?';

//api Anaquel
static obtenerAnaqueles= '/catalogoAnaquel';
//api Nivel
static obtenerNivel= '/catalogoNivel';
//api Pedidos
static obtenerProductosPedido='/obtenerProductosPedido?';
static obtenerPedidosEstatus='/obtenerPedidosEstatus?';
static obtenerPedidos='/obtenerPedidos'
static obtenerPedidosId='/obtenerPedidoId?'
static guardaPedido= '/guardarPedido';
static guardaPedidoGeneral= '/guardaPedidoGeneral';
static guardaPedidoProducto= '/guardaPedidoProducto';
static guardaIngresoProductoPedido= '/ingresoProductoPedido';
static borrarProductoPedido= '/borrarPedidoProducto';
static generarPedidoPdf='/getPedidoId?';

//Inventario
static consultaInventario ='/obtenerInventarioEsp?';
//Api ventas
static consultaVentaDetalleEstatus='/obtenerVentasClienteDetalleEstatus?';
static consultaVentaDetalleEstatusVenta='/obtenerVentasClienteDetalleEstatusVenta?';
static consultarVentaSaldo='/obtenerSaldoVentaCancela?';

static consultaVentaDetalle='/obtenerVentasDetalle';
static consultaVentasLike='/obtenerVentaslike?';
static consultaVentasTop='/obtenerVentasTop';
static consultaVentaDetalleCajaVigente='/obtenerVentasCajaVigente';
static consultaVentaDetalleEntrega='/obtenerVentasDetalleEntrega'
static consultaVentaAbonoId='/obtenerAbonosVentaId?';
static consultaVentasCaja='/obtenerVentasDetalleCaja?';
static obtenerVentaCobroParcial='/obtenerPagosParciales?';
static consultaProductoVentaId='/consultaProductoVentaId?';
static consultaProductoVentasTraer='/obtenerProductosTraer?';
static guardaVenta= '/guardarVenta';
static calcularNuevoPrecioAjustado= '/calcularNuevoPrecioAjustado';
static actualizaVentaProducto= '/actualizaVentaProducto';
static cancelaProductoVenta= '/cancelaVentaProducto';
static guardaVentaDetalle= '/guardarVentaDetalle';
static guardarVentaDescuento= '/guardarVentaDescuento';
static consultaVentaDetalleId= '/obtenerVentaDetalleId?';

static guardaVentaProductoId= '/guardaVentaProductoId';
static guardaSaldoUtilizado= '/guardarSaldoUtilizado';
static guardaVentaCobro= '/guardarVentaCobro';
static guardaVentaProductoEntrega= '/guardaVentasProducto';
static guardaAbono= '/guardarAbono';
static guardarVentaCompleta= '/guardarVentaCompleta';


static guardarMaquina= '/guardarMaquina';
static consultaProductoVentaMesId='/consultaProductoVentaMesId?';
static consultaProductoVenta='/ventasProductoHistoria?';
static obtenerVentaProductoId='/obtenerVentaProductoId?';
static consultarVentaId='/obtenerVentaId?';
static consultarMaquinaCliente='/obtenerMaquinasCliente?';
static generarVentaPdf='/getVenta?';
static generarSaldoFavorPdf='/getSaldoFavor?';
static generarInventarioPdf='/getReporteInventario?';
static generarVentaAlmacenPdf='/getVentaAlmacen?'
static descargarDocuemento='/facturacion/getDocumento?';
static generarReporteCajaPdf='/getReporteCaja?';
static generarAbonoVentaPdf='/getAbonoVentaId?';
static generarHistorialAbonoVentaPdf='/getAbonoVentaIdCliente?';
static generarVentaPedidoPdf='/getVentaPedido?';
static cambiarVentaACredito='/cambiarVentaACredito'

//Cotizaciones
static guardaCotizacion= '/guardarCotizacion';
static consultaCotizaciones='/consultaCotizaciones';
static consultaCotizacionesBusqueda='/consultaCotizacionesLike?';
static consultaCotizacionClienteProducto='/consultaCotizacionClienteProducto?';
static consultaCotizacionId='/consultaCotizacionId?';
static consultaCotizacionIdCotizacion='/consultaCotizacionIdCotizacion?';
static consultaCotizacionesIdClienteVigente='/consultaCotizacionesClienteVigente?';

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
static obtenerVentaMesAno='/totales-por-mes-ano?';
static obtenerVentaProductoAno='/total_venta_producto-ano?';
static obtenerVentasAnoVendedor='/total_venta_ano_vendedor?';
static obtenerVentasAnoMesVendedor='/total_venta_ano_mes_vendedor?';
//traspasos
static movimientoInterno='/movimientoInterno';
static guardarAjusteInventario='/guardarAjusteInventario';
static movimientoExterno='/movimientoExterno';

//factura
static consultaVentaFactura='/facturacion/ventasParaFactura';
static consultaCreditos='/facturacion/consultaCreditos?';
static facturarVenta='/facturacion/venta?';
static facturarComplemento='/facturacion/complemento?'
static consultaFacturas='/facturacion/ventasFacturadas';



}