import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

// MSAL imports
import {
  MsalService,
  MsalBroadcastService,
  MSAL_INSTANCE
} from '@azure/msal-angular';
import {
  PublicClientApplication,
  IPublicClientApplication
} from '@azure/msal-browser';

// ✅ 1. Instancia única MSAL
export const msalInstance = new PublicClientApplication({
  auth: {
    clientId: 'd875bbb3-03b0-4dc3-9bb0-f4b0dc5bd5fe',
    authority: 'https://login.microsoftonline.com/consumers',
    redirectUri: 'http://localhost:4200' // debe coincidir con Azure Portal
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: false
  }
});

// ✅ 2. Factory para proveerla a Angular
export function MSALInstanceFactory(): IPublicClientApplication {
  return msalInstance;
}

// ✅ 3. Configuración completa
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptorsFromDi()),

    // ✅ MSAL services
    { provide: MSAL_INSTANCE, useFactory: MSALInstanceFactory },
    MsalService,
    MsalBroadcastService
  ]
};