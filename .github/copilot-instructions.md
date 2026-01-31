# Copilot Instructions - Refacciones Fabela

## Project Architecture & Context

### Workspace Structure
This is a multi-root workspace containing a decoupled full-stack application:
- **Frontend**: `refacFabela/` (Angular 12, PrimeNG, Mirage Theme)
- **Backend**: `refacFabelaBack/refacFabela/` (Spring Boot 2.5.5, Java 8, MySQL)

### Core Technologies
- **Frontend**: Angular 12, PrimeNG (Mirage), NgxSpinner, RxJS 6.
- **Backend**: Spring Boot 2.5.5, Spring Security (JWT), Spring Data JPA, JasperReports (PDFs), CFDI (Mexican Invoicing).
- **Database**: MySQL 5.7/8.0 (Legacy schema support).

## Frontend Guidelines (Angular)

### API Communication Pattern (Strict)
**NEVER** hardcode API URLs in components or services.
1.  **Base URL**: Controlled by `environment.servicios.apiRefacFabela`.
2.  **Endpoints**: Must be defined as static properties in `src/app/shared/sesion/locator.ts`.

#### Endpoint Definition & Usage Example
Keep the frontend and backend synced using this pattern:

| Layer | File/Component | Definition |
|-------|----------------|------------|
| **Frontend Locator** | `src/app/shared/sesion/locator.ts` | `static obtenerClientes='/obtenerClientes';` |
| **Frontend Service** | `src/app/administracion/service/cliente.service.ts` | `const url = environment.servicios.apiRefacFabela + locator.obtenerClientes;`<br>`return this.http.get<TcCliente[]>(url);` |
| **Backend Controller**| `com.refacFabela.controller.ClientesController` | `@GetMapping("/obtenerClientes")`<br>`public List<TcCliente> obtenerClientes() { ... }` |

**Usage Rule**:
```typescript
// ✅ Correct Usage
import { locator } from '../sesion/locator';
const url = environment.servicios.apiRefacFabela + locator.obtenerClientes;
this.http.get<TcCliente[]>(url);

// ❌ WRONG - Do not hardcode paths
const url = '/api/refacFabela/obtenerClientes';
```

### Authentication & Interceptors
- **Auth Flow**: Login returns a JWT which is stored in `TokenService`.
- **Interceptors**: `ProdInterceptorService` (in `shared/interceptors/`) automatically attaches the `Authorization: Bearer <token>` header.
- **Auto-Refresh**: The interceptor handles 401 errors by calling `/auth/refresh` automatically.

### Feature Module Structure
Organize features by domain (e.g., `administracion`, `ventas`, `almacen`).
- **Lazy Loading**: All feature modules are lazy-loaded in `app-routing.module.ts`.
- **Role Guards**: Use `data: { expectedRol: ['admin', ...] }` in routes protected by `ProdGuardService`.

### Naming Conventions
- **Models**: DTOs and Interfaces often mirror backend entities but are manually maintained.
    - Example: `TcCliente`, `TvVentasDetalle`, `JwtDto`.
- **Services**: `{Domain}Service` (e.g., `VentasService`, `ClienteService`).

## Backend Guidelines (Spring Boot)

### Entity & Database Naming (Legacy Schema)
The database uses a specific prefix convention that **must** be followed in JPA entities:
- **`tc_*` (Tablas Catalogo)**: Catalogs/Lookup tables (e.g., `TcCliente`, `TcFormapago`).
- **`tw_*` (Tablas Trabajo)**: Transactional tables (e.g., `TwVenta`, `TwProductoBodega`).
- **`tv_*` (Tablas Vista)**: Database views (e.g., `TvVentasDetalle`).
- **`tr_*` (Tablas Relacion)**: Relationship/Link tables.

**Entity Example**:
```java
@Entity
@Table(name = "tc_clientes") // Explicit table name required
public class TcCliente implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "n_id_cliente") // Explicit column mapping often needed
    private Long nIdCliente;
    // ...
}
```

### Controller & DTO Pattern
- **Controllers**: Use `@RestController`, `@CrossOrigin(origins = "*")`, and usually map to `/api/refacFabela/...` via `application.properties` context path.
- **DTOs**: Use specific DTO classes (e.g., `JwtDto`, `LoginUsuario`) rather than exposing Entities directly in REST APIs.
- **Mapping**: Use `ModelMapper` for converting between Entities and DTOs.

### Reports (JasperReports)
- **Location**: `.jasper` and `.jrxml` files reside in `src/main/resources/reports`.
- **Execution**: Services load reports using `ResourceUtils` or `ClassPathResource`.

## Critical Developer Workflows

### Running Local Environment
1.  **Backend**:
    ```powershell
    # In Backend/refacFabelaBack/refacFabela
    ./mvnw spring-boot:run
    ```
    *Runs on port 4043 (defined in application.properties).*

2.  **Frontend**:
    ```powershell
    # In Frontend/refacFabela
    npm start
    ```
    *Runs `ng serve` on port 4200 with proxy to localhost:4043.*

### Common Tasks
- **New API Endpoint**:
    1.  Add endpoint in Spring `@RestController`.
    2.  Add definition in frontend `locator.ts`.
    3.  Create method in Angular Service.
- **New Report**:
    1.  Add `.jrxml` to backend resources.
    2.  Implement generation logic in Backend Service.
    3.  Create Endpoint to return PDF byte stream.
    4.  Frontend opens blob in new tab.

## Security & key Configurations
- **API Keys**: `ApiKeyMetaCompraFilter` protects specific purchase endpoints.
- **JWT**: Secrets and expiration are configured in `application.properties`.
- **CORS**: Globally allowed in Controllers.
