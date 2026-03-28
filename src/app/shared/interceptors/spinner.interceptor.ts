import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { catchError, finalize } from 'rxjs/operators';
import { MessageService } from 'primeng/api';

@Injectable()
export class SpinnerInterceptor implements HttpInterceptor {

  constructor( private spinner: NgxSpinnerService,private messageService: MessageService, ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.spinner.show();
    return next.handle(request).pipe(
      finalize(() => {
        this.spinner.hide()
      }),
      catchError((error: HttpErrorResponse)=>{
        const requestIsLogin = request.url.includes('/auth/login');
        const requestIsRefresh = request.url.includes('/auth/refresh');

        switch (error.status) {
          case 0:
            this.messageService.add({severity: 'error', summary: 'Sin conexión', detail: 'No fue posible comunicarse con el servidor. Verifica la red o el estado del backend.', life: 5000});
            break;
          case 504:
            this.messageService.add({severity: 'error', summary: 'Servidor sin respuesta', detail: 'El backend tardó demasiado en responder. Intenta nuevamente.', life: 5000});
            break;
          case 401:
            if (!requestIsLogin && !requestIsRefresh) {
              this.messageService.add({ severity: 'error', summary: 'Sesión expirada', detail: 'Tu sesión ha expirado. Por favor inicia sesión nuevamente.', life: 5000 });
            }
            break;
          case 403:
            this.messageService.add({severity: 'error', summary: 'Acceso denegado', detail: 'No tienes permisos para realizar esta acción.', life: 5000});
            break;
          case 500:
          case 502:
          case 503:
            this.messageService.add({severity: 'error', summary: 'Error del servidor', detail: 'El backend reportó un error interno. Intenta de nuevo en unos momentos.', life: 5000});
            break;
            default:
              this.messageService.add({severity: 'error', summary: 'Error en la operación', detail: this.obtenerMensaje(error), life: 5000});
              break;
        }
        return throwError(error);
      }));
  }

  private obtenerMensaje(error: HttpErrorResponse): string {
    if (typeof error.error === 'string' && error.error.trim().length > 0) {
      return error.error;
    }

    if (error.error && error.error.mensaje) {
      return error.error.mensaje;
    }

    if (error.message) {
      return error.message;
    }

    return 'Ocurrió un error inesperado. Intenta de nuevo.';
  }
}
