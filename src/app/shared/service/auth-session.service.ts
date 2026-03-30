import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, finalize, map, shareReplay, tap } from 'rxjs/operators';
import { JwtDto } from 'src/app/login/model/jwt-dto';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthSessionService {

  private refreshInFlight$: Observable<string> | null = null;

  constructor(
    private authService: AuthService,
    private tokenService: TokenService
  ) { }

  ensureValidSession(): Observable<boolean> {
    if (!this.tokenService.hasToken()) {
      return of(false);
    }

    if (!this.tokenService.isTokenExpired()) {
      return of(true);
    }

    return this.refreshSession().pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }

  refreshSession(): Observable<string> {
    const token = this.tokenService.getToken();

    if (!token) {
      return throwError('No active token');
    }

    if (this.refreshInFlight$) {
      return this.refreshInFlight$;
    }

    this.refreshInFlight$ = this.authService.refresh(new JwtDto(token)).pipe(
      map((response: any) => response?.token),
      tap((newToken: string | null | undefined) => {
        if (!newToken) {
          throw new Error('Token refresh failed');
        }
        this.tokenService.setToken(newToken);
      }),
      map((newToken: string | null | undefined) => newToken as string),
      catchError((error) => {
        this.tokenService.logout();
        return throwError(error);
      }),
      finalize(() => {
        this.refreshInFlight$ = null;
      }),
      shareReplay(1)
    );

    return this.refreshInFlight$;
  }
}