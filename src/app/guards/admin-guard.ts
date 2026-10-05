import {CanActivateFn, Router} from '@angular/router';
import {ApiAuthService} from '../services/api/api-auth.service';
import {inject} from '@angular/core';

export const adminGuard: CanActivateFn = () => {

  const auth = inject(ApiAuthService);
  const router = inject(Router);

  if (!auth.hasValidToken()) {
    return router.createUrlTree(['/login']);
  }

  if (auth.getRoleFromToken()?.toUpperCase() === 'ADMIN') {
    return true;
  }

  return router.createUrlTree(['/'])

};
