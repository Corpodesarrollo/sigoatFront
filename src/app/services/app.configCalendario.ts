import { APP_INITIALIZER, Provider } from '@angular/core';
import { PublicClientApplication, IPublicClientApplication } from '@azure/msal-browser';
import { MSAL_INSTANCE, MsalService } from '@azure/msal-angular'; // 👈 IMPORTANTE

export function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId: 'd875bbb3-03b0-4dc3-9bb0-f4b0dc5bd5fe',
      redirectUri: 'http://localhost:4200', // o producción
    },
    cache: {
      cacheLocation: 'localStorage',
      storeAuthStateInCookie: false,
    }
  });
}

export function initializeMsal(msalInstance: IPublicClientApplication) {
  return async () => {
    await msalInstance.initialize();

    const response = await msalInstance.handleRedirectPromise();
    if (response?.account) {
      msalInstance.setActiveAccount(response.account);
    } else {
      const cuentas = msalInstance.getAllAccounts();
      if (cuentas.length > 0) {
        msalInstance.setActiveAccount(cuentas[0]);
      }
    }
  };
}

export const appConfig: Provider[] = [
  {
    provide: MSAL_INSTANCE, // ✅ usa el token real, no un string
    useFactory: MSALInstanceFactory,
  },
  {
    provide: APP_INITIALIZER,
    useFactory: initializeMsal,
    deps: [MSAL_INSTANCE],
    multi: true,
  },
  MsalService // ✅ necesario para la inyección en componentes y servicios
];