import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { showToast } from 'src/app/tools/message-routines';
import { Usuario } from '../model/usuario';
import { Storage } from '@ionic/storage-angular';
import { DataBaseService } from './data-base.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  keyUsuario = 'USUARIO_AUTENTICADO';
  usuarioAutenticado = new BehaviorSubject<Usuario | null>(null);

  primerInicioSesion = new BehaviorSubject<boolean>(false);
  componenteSeleccionado = new BehaviorSubject<string>('codigoqr');
  storageQrCodeKey = 'QR_CODE';
  qrCodeData = new BehaviorSubject<string | null>(null);

  constructor(private router: Router, private bd: DataBaseService, private storage: Storage) {}

  async inicializarAutenticacion() {
    await this.storage.create();
  }

  async isAuthenticated(): Promise<boolean> {
    return await this.leerUsuarioAutenticado().then((usuario) => usuario !== null);
  }
  async leerUsuarioAutenticado(): Promise<Usuario | null> {
    const usuarioData = await this.storage.get(this.keyUsuario) as Usuario;
    if (usuarioData) {
      const usuario = new Usuario();
      Object.assign(usuario, usuarioData);
      console.log('Usuario autenticado leído desde el almacenamiento:', usuario);
      this.usuarioAutenticado.next(usuario);
      return usuario;
    }
    console.warn('No se encontró usuario autenticado en el almacenamiento.');
    this.usuarioAutenticado.next(null);
    return null;
  }
  
  
  
  

  guardarUsuarioAutenticado(usuario: Usuario) {
    // Asegurarte de que la fecha de nacimiento sea válida
    if (usuario.fechaNacimiento && !(usuario.fechaNacimiento instanceof Date)) {
      usuario.fechaNacimiento = new Date(usuario.fechaNacimiento);
    }
  
    // Asegurarte de que la pregunta secreta esté definida
    if (!usuario.preguntaSecreta || usuario.preguntaSecreta.trim() === '') {
      usuario.preguntaSecreta = '¿Cuál es tu animal favorito?'; // Pregunta predeterminada
    }
  
    console.log('Guardando usuario autenticado con pregunta secreta:', usuario.preguntaSecreta);
  
    // Guardar usuario en el almacenamiento y notificar a los observadores
    this.storage.set(this.keyUsuario, usuario);
    this.usuarioAutenticado.next(usuario);
  }
  
  
  

  obtenerUsuario(): Usuario | null {
    return this.usuarioAutenticado.value;
  }

  eliminarUsuarioAutenticado() {
    this.storage.remove(this.keyUsuario);
    this.usuarioAutenticado.next(null);
  }

  async login(cuenta: string, password: string) {
    const usuarioAutenticado = await this.storage.get(this.keyUsuario);
    if (usuarioAutenticado) {
      this.usuarioAutenticado.next(usuarioAutenticado);
      console.log('Usuario autenticado encontrado:', this.usuarioAutenticado.value);
      this.primerInicioSesion.next(false);
  
      // Redirige solo si el usuario está en la página de ingreso
      if (this.router.url === '/ingreso') {
        this.router.navigate(['/inicio']);
      }
    } else {
      const usuario = await this.bd.buscarUsuarioValido(cuenta, password);
      if (usuario) {
        showToast(`¡Bienvenido(a) ${usuario.nombre} ${usuario.apellido}!`);
        this.guardarUsuarioAutenticado(usuario);
        console.log('Usuario guardado en el Storage:', usuario);
        this.primerInicioSesion.next(true);
  
        // Redirige solo si el usuario está en la página de ingreso
        if (this.router.url === '/ingreso') {
          this.router.navigate(['/inicio']);
        }
      } else {
        showToast('El correo o la contraseña son incorrectos');
        this.router.navigate(['/ingreso']);
      }
    }
  }
  
  

  async logout() {
    const usuario = await this.leerUsuarioAutenticado();
    if (usuario) {
      showToast(`¡Hasta pronto ${usuario.nombre} ${usuario.apellido}!`);
      this.eliminarUsuarioAutenticado();
    }
  
    // Redirige solo si no estás ya en una página pública
    if (this.router.url !== '/recuperar-contraseña') {
      this.router.navigate(['/ingreso']);
    }
  }
}  