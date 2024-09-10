import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import {JwtModule} from '@auth0/angular-jwt';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
      provideZoneChangeDetection({ eventCoalescing: true }),
      provideRouter(routes),
      provideAnimationsAsync(),
      provideHttpClient(withInterceptorsFromDi()),
      importProvidersFrom(
        JwtModule.forRoot({
          config: {
              tokenGetter: ()=>{
                return localStorage.getItem("access_token");
              },
              allowedDomains: ["localhost:7233"],
          },
      }), 
      )
    ]
};
