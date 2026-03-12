import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { TokenService } from '../service/token.service';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../service/auth.service';
import { JwtDto } from 'src/app/login/model/jwt-dto';

@Injectable({
  providedIn: 'root'
})
export class ProdInterceptorService implements HttpInterceptor {

  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  constructor(private tokenService: TokenService, private auth: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (!this.tokenService.isLogged()) {
      return next.handle(req);
    }

    let intReq = this.addToken(req, this.tokenService.getToken());

    return next.handle(intReq).pipe(catchError((err: HttpErrorResponse) => {
      if (err.status === 401) {
        return this.handle401Error(req, next);
      }
      return throwError(err);
    }));
  }

  private handle401Error(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      // Primer 401 — iniciar refresh
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      const dto: JwtDto = new JwtDto(this.tokenService.getToken());

      return this.auth.refresh(dto).pipe(
        switchMap((data: any) => {
          this.isRefreshing = false;
          if (data && data.token) {
            this.tokenService.setToken(data.token);
            this.refreshTokenSubject.next(data.token);
            return next.handle(this.addToken(req, data.token));
          }
          // Refresh falló — cerrar sesión
          this.tokenService.logout();
          return throwError('Token refresh failed');
        }),
        catchError((refreshErr) => {
          this.isRefreshing = false;
          this.tokenService.logout();
          return throwError(refreshErr);
        })
      );
    } else {
      // Ya hay un refresh en curso — esperar a que termine y reintentar
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(token => {
          return next.handle(this.addToken(req, token));
        })
      );
    }
  }

  private addToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
    return req.clone({ headers: req.headers.set('Authorization', 'Bearer ' + token) });
  }
}

export const interceptorProvider = [{ provide: HTTP_INTERCEPTORS, useClass: ProdInterceptorService, multi: true }];
