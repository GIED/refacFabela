export class locator{

// api para clientes
static obtenerClientes='/obtenerClientes';
static obtenerClienteLike='/consultaClienteLike?';
static obtenerSaldoGeneral='/consultaClienteIdSaldo?'
static guardarClientes='/guardarCliente';
static consultaClientesSaldos='/consultaClienteSaldo'
// api para proveedores
static obtenerProveedores='/obtenerProveedores';
static guardarProveedores='/guardarProveedores';
//api para usuarios
static obtenerUsuarios='/obtenerUsuarios';
static nuevoUsuario = '/nuevo';
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
static guardarProductoAlternativo = '/guardarProductoAlternativo'
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
static consultaVentaDetalleEstatus='/obtenerVentasClienteDetalleEstatus?'
static consultaVentaDetalle='/obtenerVentasDetalle'
static consultaVentaAbonoId='/obtenerAbonosVentaId?';
static consultaProductoVentaId='/consultaProductoVentaId?';
static guardaVenta= '/guardarVenta';
static consultaProductoVentaMesId='/consultaProductoVentaMesId?';

//Cotizaciones
static guardaCotizacion= '/guardarCotizacion';
static consultaCotizaciones='/consultaCotizaciones'
static consultaCotizacionId='/consultaCotizacionId?'

//Tablero

static obtenerTotalesGeneralesTablero='/totales-generales-tablero';



}