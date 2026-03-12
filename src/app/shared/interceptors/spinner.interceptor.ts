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
        switch (error.status) {
          case 504:
            this.messageService.add({severity: 'error', summary: 'Error de conexión', detail: 'Error de conexión con el servidor', life: 3000});
            break;
          case 401:
            // No mostrar toast genérico si es del login — el componente lo maneja
            if (!request.url.includes('/auth/login')) {
              this.messageService.add({ severity: 'error', summary: 'Sesión expirada', detail: 'Tu sesión ha expirado. Por favor inicia sesión nuevamente.', life: 5000 });
            }
            break;
            default:
              this.messageService.add({severity: 'error', summary: 'Error de conexión', detail: 'Ocurrió un error, intenta de nuevo.', life: 3000});
              break;
        }
        return throwError(error);
      }));
  }
}
