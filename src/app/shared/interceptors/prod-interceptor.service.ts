import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { TokenService } from '../service/token.service';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { AuthSessionService } from '../service/auth-session.service';

@Injectable({
  providedIn: 'root'
})
export class ProdInterceptorService implements HttpInterceptor {

  private readonly refreshFailedToken = 'REFRESH_FAILED';
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  constructor(private tokenService: TokenService, private authSessionService: AuthSessionService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.isAuthRequest(req)) {
      return next.handle(req);
    }

    const token = this.tokenService.getToken();

    if (!token) {
      return next.handle(req);
    }

    if (this.tokenService.isTokenExpired()) {
      return this.authSessionService.refreshSession().pipe(
        switchMap((newToken: string) => next.handle(this.addToken(req, newToken))),
        catchError((error) => throwError(error))
      );
    }

    const intReq = this.addToken(req, token);

    return next.handle(intReq).pipe(catchError((err: HttpErrorResponse) => {
      if (err.status === 401 && this.tokenService.hasToken()) {
        return this.handle401Error(req, next);
      }
      return throwError(err);
    }));
  }

  private handle401Error(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authSessionService.refreshSession().pipe(
        switchMap((token: string) => {
          this.isRefreshing = false;
          if (token) {
            this.refreshTokenSubject.next(token);
            return next.handle(this.addToken(req, token));
          }

          this.handleRefreshFailure('Token refresh failed');
          return throwError('Token refresh failed');
        }),
        catchError((refreshErr) => {
          this.handleRefreshFailure(refreshErr);
          return throwError(refreshErr);
        })
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(token => {
          if (token === this.refreshFailedToken) {
            return throwError('Token refresh failed');
          }
          return next.handle(this.addToken(req, token));
        })
      );
    }
  }

  private handleRefreshFailure(error: any): void {
    this.isRefreshing = false;
    this.refreshTokenSubject.next(this.refreshFailedToken);
    this.tokenService.logout();
  }

  private isAuthRequest(req: HttpRequest<any>): boolean {
    return req.url.includes('/auth/login') || req.url.includes('/auth/refresh');
  }

  private addToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
    return req.clone({ headers: req.headers.set('Authorization', 'Bearer ' + token) });
  }
}

export const interceptorProvider = [{ provide: HTTP_INTERCEPTORS, useClass: ProdInterceptorService, multi: true }];
