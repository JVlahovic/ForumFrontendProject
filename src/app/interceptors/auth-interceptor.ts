import { HttpInterceptorFn } from '@angular/common/http';
import {inject} from '@angular/core';
import {ApiAuthService} from '../services/api/api-auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  //circular DI: if it fails to resolve, make a utility. Note to self.
  const apiAuthService = inject(ApiAuthService);
  const token = localStorage.getItem('loginToken');


  if(token && !apiAuthService.isTokenExpired(token)) {
    const cloned = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
    return next(cloned);
  }

  if(token) {
    apiAuthService.clearSession();
  }

  return next(req);

};
