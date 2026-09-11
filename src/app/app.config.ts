import {ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners} from '@angular/core';
import { provideRouter } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {provideHttpClient, withInterceptors} from '@angular/common/http';

import { routes } from './app.routes';
import {authInterceptor} from './interceptors/auth-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    importProvidersFrom(FormsModule),
    provideHttpClient(withInterceptors([authInterceptor]))
  ]
};
