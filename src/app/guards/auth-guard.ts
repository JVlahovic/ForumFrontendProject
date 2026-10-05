import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {ApiAuthService} from '../services/api/api-auth.service';

export const authGuard: CanActivateFn = () => {

  const auth = inject(ApiAuthService);
  const router = inject(Router);

  return auth.hasValidToken() ? true : router.createUrlTree(['/login']);

};
