import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router'; // Importa RouterModule
import { QrComponent } from './components/qr/qr.component';
import { NgxQRCodeModule } from 'ngx-qrcode2';

import { AppComponent } from './app.component';
import { ForoComponent } from './components/foro/foro.component';
import { routes as AppRoutes } from './app.routes'; // Importa las rutas desde app.routes

@NgModule({
  declarations: [
    AppComponent,
    ForoComponent,
    QrComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    RouterModule.forRoot(AppRoutes),  // Utiliza RouterModule con las rutas de app.routes
    FormsModule,
    HttpClientModule,
    NgxQRCodeModule,

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule {}
