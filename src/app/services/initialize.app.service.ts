import { AuthService } from 'src/app/services/auth.service';
import { Injectable } from '@angular/core';
import { SQLiteService } from './sqlite.service';
import { DataBaseService } from './data-base.service';

@Injectable({
  providedIn: 'root'
})
export class InitializeAppService {
  isAppInit: boolean = false;
  platform!: string;

  constructor(
    private sqliteService: SQLiteService,
    private storageService: DataBaseService,
    private authService: AuthService) { }

  async inicializarAplicacion() {
    // Inicializar plugin de SQLite
    await this.sqliteService.inicializarPlugin().then(async (ret) => {
      this.platform = this.sqliteService.platform;
      try {
        // Si la App está siendo ejecutada en un browser, se debe inicializar el 
        // almacenamiento de la base de datos en el navegador.
        if( this.sqliteService.platform === 'web') {
          await this.sqliteService.inicializarAlmacenamientoWeb();
        }
        // Inicializar la base de datos del sistema en SQLite. La base de datos
        await this.storageService.inicializarBaseDeDatos();
        // if( this.sqliteService.platform === 'web') {
        //   await this.sqliteService.guardarNombreBaseDeDatos();
        // }
        // Inicializar servicio de autenticación
        this.authService.inicializarAutenticacion();
        this.isAppInit = true;
      } catch (error) {
        console.log(`inicializarAplicacionError: ${error}`);
      }
    });
  }

}
