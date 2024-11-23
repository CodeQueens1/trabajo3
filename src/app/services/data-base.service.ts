import { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Injectable } from '@angular/core';
import { SQLiteService } from './sqlite.service';
import { Usuario } from '../model/usuario';
import { BehaviorSubject } from 'rxjs';
import { NivelEducacional } from '../model/nivel-educacional';
import { showAlertError } from '../tools/message-functions';

@Injectable({
  providedIn: 'root',
})
export class DataBaseService {
  userUpgrades = [
    {
      toVersion: 1,
      statements: [
        `
        CREATE TABLE IF NOT EXISTS USUARIO (
          cuenta TEXT PRIMARY KEY NOT NULL,
          correo TEXT NOT NULL,
          password TEXT NOT NULL,
          preguntaSecreta TEXT NOT NULL,
          respuestaSecreta TEXT NOT NULL,
          nombre TEXT NOT NULL,
          apellido TEXT NOT NULL,
          nivelEducacional INTEGER NOT NULL,
          fechaNacimiento INTEGER NOT NULL
        );
      `,
      ],
    },
    {
      toVersion: 2,
      statements: [
        `
        ALTER TABLE USUARIO ADD COLUMN direccion TEXT;
      `,
      ],
    },
  ];

  sqlInsertUpdate = `
    INSERT OR REPLACE INTO USUARIO (
      cuenta,
      correo,
      password,
      preguntaSecreta,
      respuestaSecreta,
      nombre,
      apellido,
      nivelEducacional,
      fechaNacimiento,
      direccion
    ) VALUES (?,?,?,?,?,?,?,?,?,?);
  `;

  nombreBD = 'basedatos';
  db!: SQLiteDBConnection;
  listaUsuarios: BehaviorSubject<Usuario[]> = new BehaviorSubject<Usuario[]>([]);
  datosQR: BehaviorSubject<string> = new BehaviorSubject('');

  constructor(private sqliteService: SQLiteService) {}

 
  async inicializarBaseDeDatos() {
    try {
      await this.sqliteService.crearBaseDeDatos({
        database: this.nombreBD,
        upgrade: this.userUpgrades,
      });
  
      console.log('Base de datos inicializada.');
  
      this.db = await this.sqliteService.abrirBaseDeDatos(
        this.nombreBD,
        false,
        'no-encryption',
        2,
        false
      );
      console.log('Conexión a la base de datos establecida.');
  
      await this.crearUsuariosDePrueba();
      await this.leerUsuarios();
    } catch (error) {
      console.error('Error al inicializar la base de datos:', error);
    }
  }
  
  
  
  async crearUsuariosDePrueba() {
    try {
      await this.guardarUsuario(
        Usuario.getNewUsuario(
          'atorres',
          'atorres@duocuc.cl',
          '1234',
          '¿Cuál es tu animal favorito?',
          'gato',
          'Ana',
          'Torres',
          NivelEducacional.buscarNivelEducacional(6)!,
          new Date(2000, 0, 5),
          'San Luis 234, La Florida'
        )
      );

      await this.guardarUsuario(
        Usuario.getNewUsuario(
          'jperez',
          'jperez@duocuc.cl',
          '5678',
          '¿Cuál es tu postre favorito?',
          'panqueques',
          'Juan',
          'Pérez',
          NivelEducacional.buscarNivelEducacional(5)!,
          new Date(2000, 1, 10),
          'Av. Providencia 123, Santiago'
        )
      );

      await this.guardarUsuario(
        Usuario.getNewUsuario(
          'cmujica',
          'cmujica@duocuc.cl',
          '0987',
          '¿Cuál es tu vehículo favorito?',
          'moto',
          'Carla',
          'Mujica',
          NivelEducacional.buscarNivelEducacional(6)!,
          new Date(2000, 2, 20),
          'Calle Los Aromos 456, Valparaíso'
        )
      );
    } catch (error) {
      console.error('Error al crear usuarios de prueba:', error);
    }
  }

 
  async guardarUsuario(usuario: Usuario): Promise<void> {
    // Validación de datos antes de guardar
    if (!usuario.cuenta || !usuario.correo || !usuario.password || !usuario.direccion || !usuario.nivelEducacional || !usuario.nivelEducacional.id) {
      console.error('Datos incompletos para guardar el usuario:', usuario);
      throw new Error('Los datos del usuario son incompletos. Verifica los campos obligatorios.');
    }
  
    console.log('Preparando para guardar usuario en la base de datos:', usuario);
  
    const fechaNacimiento = usuario.fechaNacimiento instanceof Date
      ? usuario.fechaNacimiento
      : new Date(usuario.fechaNacimiento || 0); // Default to epoch if fechaNacimiento is invalid
  
    const parametros = [
      usuario.cuenta,
      usuario.correo,
      usuario.password,
      usuario.preguntaSecreta,
      usuario.respuestaSecreta,
      usuario.nombre,
      usuario.apellido,
      usuario.nivelEducacional.id, // Asegura que este campo tiene un valor válido
      fechaNacimiento.getTime(),
      usuario.direccion
    ];
  
    console.log('Parámetros que se enviarán al SQL:', parametros);
  
    try {
      await this.db.run(this.sqlInsertUpdate, parametros);
      console.log('Usuario guardado correctamente en la base de datos.');
      await this.leerUsuarios(); // Recarga usuarios después de guardar
    } catch (error) {
      console.error('Error al ejecutar el comando SQL:', error);
      throw new Error('Error al guardar los datos del usuario en la base de datos.');
    }
  }
  
  
  

  async leerUsuarios(): Promise<void> {
    try {
      const usuarios: Usuario[] = (
        await this.db.query('SELECT * FROM USUARIO;')
      ).values as Usuario[];
      this.listaUsuarios.next(usuarios);
    } catch (error) {
      console.error('Error al leer usuarios de la base de datos:', error);
    }
  }

  async leerUsuario(cuenta: string): Promise<Usuario | undefined> {
    try {
      const usuarios: Usuario[] = (
        await this.db.query('SELECT * FROM USUARIO WHERE cuenta=?;', [cuenta])
      ).values as Usuario[];

      if (usuarios.length > 0) {
        const usuario = usuarios[0];
        usuario.direccion = usuario.direccion || ''; // Inicializa dirección si está vacía
        return usuario;
      }
      return undefined;
    } catch (error) {
      console.error('Error al leer el usuario de la base de datos:', error);
      return undefined;
    }
  }

  async eliminarUsuarioUsandoCuenta(cuenta: string): Promise<void> {
    try {
      await this.db.run('DELETE FROM USUARIO WHERE cuenta=?', [cuenta]);
      await this.leerUsuarios();
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
    }
  }

  async buscarUsuarioValido(cuenta: string, password: string): Promise<Usuario | undefined> {
    try {
      const usuarios: Usuario[] = (
        await this.db.query('SELECT * FROM USUARIO WHERE cuenta=? AND password=?;', [cuenta, password])
      ).values as Usuario[];
      return usuarios[0];
    } catch (error) {
      console.error('Error al buscar usuario válido:', error);
      return undefined;
    }
  }

  async buscarUsuarioPorCuenta(cuenta: string): Promise<Usuario | undefined> {
    try {
      const usuarios: Usuario[] = (
        await this.db.query('SELECT * FROM USUARIO WHERE cuenta=?;', [cuenta])
      ).values as Usuario[];
      return usuarios[0];
    } catch (error) {
      console.error('Error al buscar usuario por cuenta:', error);
      return undefined;
    }
  }

  async buscarUsuarioPorCorreo(correo: string): Promise<Usuario | undefined> {
    try {
      console.log('Buscando usuario con correo:', correo);
  
      const usuarios: Usuario[] = (
        await this.db.query('SELECT * FROM USUARIO WHERE correo = ?;', [correo])
      ).values as Usuario[];
  
      if (usuarios.length > 0) {
        const usuario = usuarios[0];
        
        // Asegurarte de que la pregunta secreta esté definida
        if (!usuario.preguntaSecreta || usuario.preguntaSecreta.trim() === '') {
          usuario.preguntaSecreta = '¿Cuál es tu animal favorito?'; // Valor predeterminado
        }
  
        console.log('Usuario encontrado:', usuario);
        console.log('Pregunta secreta del usuario:', usuario.preguntaSecreta);
  
        return usuario;
      } else {
        console.warn('No se encontró usuario con el correo:', correo);
        return undefined;
      }
    } catch (error) {
      console.error('Error al buscar usuario por correo:', error);
      return undefined;
    }
  }
  
}
