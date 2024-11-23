import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

// CGV-INI-Imports-Traductor

import { TranslateLoader, TranslateModule, TranslateModuleConfig } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';

export function HttpLoaderFactory(http: HttpClient) { 
  return new TranslateHttpLoader(http, './assets/i18n/', '.json'); 
}

const translateModuleConfig: TranslateModuleConfig = { 
  defaultLanguage: 'es', 
  loader: { 
    provide: TranslateLoader, 
    useFactory: HttpLoaderFactory, 
    deps: [HttpClient] } 
};

// CGV-FIN-Imports-Traductor

/**
 *  CGV-INI-BASE-DATOS:
 * 
 * Para que la App pueda ser usada en un browser, se habilitará "jeepSqlite",
 * lo que permitirá usar la base de datos del browser, la que se puede
 * revisar en el menú "Application" durante la depuración en Chrome.
 * 
 * ¡¡¡IMPORTANTE!!!
 * Se debe copiar manualmente el archivo "sql-wasm.wasm" desde la
 * carpeta "/node_modules/sql.js/dist/sql-wasm.wasm" a la carpeta "/src/assets"
 * 
 */

import { Capacitor } from '@capacitor/core';
import { defineCustomElements as jeepSqlite} from 'jeep-sqlite/loader';
import { APP_INITIALIZER } from '@angular/core';
import { SQLiteService } from './app/services/sqlite.service';
import { DataBaseService } from './app/services/data-base.service';
import { InitializeAppService } from './app/services/initialize.app.service';
import { AuthService } from './app/services/auth.service';
import { Storage } from '@ionic/storage-angular';
import { APIClientService } from './app/services/api-client.service';
import { IonicModule } from '@ionic/angular';

const platform = Capacitor.getPlatform();
if(platform === "web") {
  jeepSqlite(window);
  window.addEventListener('DOMContentLoaded', async () => {
      const jeepEl = document.createElement("jeep-sqlite");
      document.body.appendChild(jeepEl);
      jeepEl.autoSave = true;
  });
}

export function initializeFactory(init: InitializeAppService) {
  return () => init.inicializarAplicacion();
}
// CGV-FIN-BASE-DATOS

bootstrapApplication(AppComponent, {
  providers: [
      { 
          provide: RouteReuseStrategy
        , useClass: IonicRouteStrategy 
      }
    , provideIonicAngular()
    , provideRouter(routes, withPreloading(PreloadAllModules))
    , provideAnimationsAsync()

    // CGV-INI-Providers-Traductor
    , provideHttpClient()
    , importProvidersFrom(TranslateModule.forRoot(translateModuleConfig)),
    // CGV-FIN-Providers-Traductor

    // CGV-INI-BASE-DATOS En esta sección se agregan los servicios que hemos implementado.
    importProvidersFrom(IonicModule.forRoot({ innerHTMLTemplatesEnabled: true })),
    importProvidersFrom(HttpClient),
    InitializeAppService,
    SQLiteService,
    DataBaseService,
    AuthService,
    Storage,
    APIClientService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeFactory,
      deps: [InitializeAppService],
      multi: true
    }
    // CGV-FIN-BASE-DATOS

  ],
});
