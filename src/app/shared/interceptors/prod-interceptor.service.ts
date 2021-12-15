import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { TokenService } from '../service/token.service';
import {catchError, concatMap} from 'rxjs/operators'
import { AuthService } from '../service/auth.service';
import { JwtDto } from 'src/app/login/model/jwt-dto';



@Injectable({
  providedIn: 'root'
})
export class ProdInterceptorService implements HttpInterceptor{


  constructor(private tokenService:TokenService , private auth:AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (!this.tokenService.isLogged()) {
        return next.handle(req);
    }

    let intReq = req;
    const token = this.tokenService.getToken();
    intReq = this.addToken(req, token);
    
    return next.handle(intReq).pipe(catchError((err: HttpErrorResponse) => {
      if (err.status === 401) {
        const dto: JwtDto = new JwtDto(this.tokenService.getToken());
        return this.auth.refresh(dto).pipe(concatMap( (data:any) => {
          console.log("refreshing ......");
          this.tokenService.setToken(data.token);
          intReq = this.addToken(req, data.token);
          return next.handle(intReq);
        }));
      }else{
        this.tokenService.logout();
        return throwError(err);
      }
    }));
  } 
  
  private addToken(req: HttpRequest<any>, token:string): HttpRequest<any>{
    return req.clone({headers: req.headers.set('Authorization', 'Bearer '+ token)});
  }
  
}

export const interceptorProvider = [{provide: HTTP_INTERCEPTORS, useClass: ProdInterceptorService, multi: true}];
